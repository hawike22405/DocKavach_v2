import base64
import binascii
import io
import re
import numpy as np
from PIL import Image


class ImageDecodeError(Exception):
    pass


MAX_IMAGE_BYTES = 12 * 1024 * 1024
MAX_IMAGE_DIMENSION = 6000
_DATA_URL_RE = re.compile(r"^data:image/(?:png|jpeg|jpg|webp);base64,", re.IGNORECASE)


def decode_base64_image(b64_string: str) -> Image.Image:
    """Decode a bounded image payload and reject malformed or oversized input."""
    if not isinstance(b64_string, str) or not b64_string.strip():
        raise ImageDecodeError("Empty image data")

    b64_string = b64_string.strip()
    if b64_string.startswith("data:"):
        if not _DATA_URL_RE.match(b64_string):
            raise ImageDecodeError("Unsupported image data URL")
        b64_string = b64_string.split(",", 1)[1]

    # A base64 value at this size cannot decode into an accepted image.
    if len(b64_string) > ((MAX_IMAGE_BYTES * 4 + 2) // 3) * 4:
        raise ImageDecodeError("Image payload too large")

    try:
        raw = base64.b64decode(b64_string, validate=True)
    except (binascii.Error, ValueError) as e:
        raise ImageDecodeError("Invalid base64 image data") from e

    if len(raw) > MAX_IMAGE_BYTES:
        raise ImageDecodeError("Image payload too large")

    try:
        with Image.open(io.BytesIO(raw)) as img:
            img.verify()
        with Image.open(io.BytesIO(raw)) as img:
            width, height = img.size
            if width <= 0 or height <= 0 or max(width, height) > MAX_IMAGE_DIMENSION:
                raise ImageDecodeError("Image dimensions exceed the allowed limit")
            img.load()
            return img.convert("RGB")
    except ImageDecodeError:
        raise
    except Exception as e:
        raise ImageDecodeError("Unsupported or corrupt image") from e


def pil_to_cv2(img: Image.Image) -> np.ndarray:
    import cv2
    arr = np.array(img)
    return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)


def encode_pil_to_base64(img: Image.Image, fmt="JPEG") -> str:
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return base64.b64encode(buf.getvalue()).decode()


def decode_and_merge_documents(b64_list: list[str]) -> Image.Image:
    """Decodes a list of base64 documents (images, pdfs, docx) and merges them vertically."""
    if not b64_list:
        raise ImageDecodeError("No documents provided")
        
    images = []
    
    for b64 in b64_list:
        b64 = b64.strip()
        if not b64.startswith("data:"):
            images.append(decode_base64_image(b64))
            continue
            
        header, data_str = b64.split(",", 1)
        mime = header.split(";")[0].split(":")[1].lower()
        
        try:
            raw = base64.b64decode(data_str, validate=True)
        except (binascii.Error, ValueError) as e:
            raise ImageDecodeError("Invalid base64 document data") from e
            
        if len(raw) > MAX_IMAGE_BYTES:
            raise ImageDecodeError("Document payload too large")
            
        if "pdf" in mime:
            import fitz  # PyMuPDF
            try:
                pdf = fitz.open(stream=raw, filetype="pdf")
                for page in pdf:
                    pix = page.get_pixmap(dpi=150)
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    images.append(img)
            except Exception as e:
                raise ImageDecodeError("Failed to parse PDF document") from e
                
        elif "wordprocessingml" in mime or "msword" in mime:
            import docx
            try:
                doc = docx.Document(io.BytesIO(raw))
                text = "\n".join([p.text for p in doc.paragraphs])
                # Draw text onto a blank PIL image
                from PIL import ImageDraw, ImageFont
                # Basic layout
                img = Image.new("RGB", (1200, 1600), color="white")
                draw = ImageDraw.Draw(img)
                # Ensure we don't draw too much text off-screen
                draw.text((40, 40), text[:4000], fill="black", spacing=4)
                images.append(img)
            except Exception as e:
                raise ImageDecodeError("Failed to parse Word document") from e
                
        elif "image" in mime:
            images.append(decode_base64_image(b64))
        else:
            raise ImageDecodeError(f"Unsupported document type: {mime}")

    if not images:
        raise ImageDecodeError("No valid pages found in documents")
        
    # Stitch vertically
    total_height = sum(img.height for img in images)
    max_width = max(img.width for img in images)
    
    # Cap total height to prevent memory blowouts (e.g. 50 page pdf)
    if total_height > 20000:
        total_height = 20000

    merged = Image.new("RGB", (max_width, total_height), color="white")
    y_offset = 0
    for img in images:
        if y_offset >= 20000:
            break
        merged.paste(img, (0, y_offset))
        y_offset += img.height

    return merged

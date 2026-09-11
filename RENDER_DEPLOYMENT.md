Backend Build Command: pip install -r requirements.txt

Backend Start Command: gunicorn app:create_app()

Frontend Build Command: npm install && npm run build

Frontend Start Command: npm start

CRITICAL: PaddleOCR requires significant RAM for model weights. The Render Free Tier (512MB RAM) will likely trigger an Out-Of-Memory (OOM) crash upon the first POST request to /api/screen. The backend Render service must be provisioned on a Starter ($7/mo) or Standard ($25/mo) tier for the duration of the hackathon demonstration to ensure stability.

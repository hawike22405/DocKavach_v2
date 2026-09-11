import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("ctos-card", className)} {...props} />;
}
export function CardHeading({ title, description }: { title: string; description?: string }) {
  return <div className="ctos-card-heading"><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

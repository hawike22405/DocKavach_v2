"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const PUBLIC_ROUTES = ["/login", "/register"];

/**
 * Wraps the app's children. On mount it hydrates auth from localStorage.
 * If the user is not logged in and is on a protected route, redirect to /login.
 * If logged in and on /login, redirect to /.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { officer, loading, hydrate } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!officer && !isPublic) {
      router.replace("/login");
    } else if (officer && isPublic) {
      router.replace("/");
    }
  }, [officer, loading, pathname, router]);

  // Show a simple loading state while hydrating
  if (loading) {
    return (
      <div className="ctos-auth-loading">
        <div className="flex flex-col items-center gap-3">
          <div className="ctos-spinner" />
          <p>Verifying secure operator session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

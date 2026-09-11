"use client";

import { usePathname, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, ShieldCheck, Radio, Landmark } from "lucide-react";

const HIDE_CHROME_ROUTES = ["/login", "/register"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter();
  const { officer, logout } = useAuthStore();
  const showChrome = !HIDE_CHROME_ROUTES.includes(pathname) && Boolean(officer);
  const signOut = () => { logout(); router.replace("/login"); };

  return <AuthGuard>
    {showChrome && <Sidebar />}
    {showChrome && <header className="national-topbar">
      <div className="national-topbar-left"><Landmark size={14} /><span className="national-route">CT-OS / NATIONAL IDENTITY SCREENING</span><span className="national-divider">/</span><span>{pathname === "/history" ? "AUDIT HISTORY" : pathname === "/settings" ? "SYSTEM SETTINGS" : "SCREENING CENTRE"}</span></div>
      <div className="national-topbar-right"><span className="national-online"><i /> NETWORK ONLINE</span><span className="national-user"><ShieldCheck size={14} /> {officer?.name}</span><button onClick={signOut} title="Sign out" aria-label="Sign out" className="national-icon-button"><LogOut size={15} /></button></div>
    </header>}
    <main className={showChrome ? "cyber-app-main" : ""}>{children}</main>
    {showChrome && <div className="national-global-status"><Radio size={11} /> ENCRYPTED CHANNEL <span /> OCR READY <span /> FACE MATCH READY <span /> AUDIT ACTIVE</div>}
  </AuthGuard>;
}

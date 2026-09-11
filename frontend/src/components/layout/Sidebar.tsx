"use client";

import { LayoutDashboard, ScanLine, History, Settings, ShieldCheck, Wifi, Landmark } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, code: "01" },
  { label: "Scan Document", href: "/#screening", icon: ScanLine, code: "02" },
  { label: "History", href: "/history", icon: History, code: "03" },
  { label: "Settings", href: "/settings", icon: Settings, code: "04" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="cyber-sidebar">
      <div className="cyber-logo-block"><div className="cyber-logo-mark"><ShieldCheck size={23} /></div><div><strong>DocKavach</strong><small>National Identity Screening</small></div></div>
      <div className="cyber-sidebar-rule" />
      <div className="national-side-kicker"><Landmark size={12} /> National operations</div>
      <nav className="cyber-nav" aria-label="Primary">
        {NAV_ITEMS.map(({ label, href, icon: Icon, code }) => {
          const active = label === "Dashboard" ? pathname === "/" : label === "Scan Document" ? false : pathname === href;
          return <Link key={label} href={href} className={clsx("cyber-nav-item", active && "active")} aria-current={active ? "page" : undefined}><span className="cyber-nav-code">{code}</span><Icon size={17} /><span>{label}</span>{active && <b>›</b>}</Link>;
        })}
      </nav>
      <div className="cyber-side-spacer" />
      <div className="cyber-graffiti">TRUSTED<br />IDENTITY<br /><em>VERIFICATION</em></div>
      <div className="cyber-station-card"><div><Wifi size={13} /> STATION STATUS</div><strong><i /> ONLINE · LANE 03</strong><small>Secure channel · audit enabled</small></div>
    </aside>
  );
}

"use client";

export function CTOsGlobe() {
  return <div className="ctos-globe" aria-label="CT-OS India and global operations visualization" role="img">
    <div className="ctos-globe-ring ring-a" /><div className="ctos-globe-ring ring-b" />
    <div className="ctos-globe-core">
      <div className="ctos-grid longitude l1" /><div className="ctos-grid longitude l2" /><div className="ctos-grid longitude l3" />
      <div className="ctos-grid latitude lat1" /><div className="ctos-grid latitude lat2" /><div className="ctos-grid latitude lat3" />
      <span className="ctos-india-marker" title="India operations node" />
    </div>
    <div className="ctos-orbit orbit-1" /><div className="ctos-orbit orbit-2" />
  </div>;
}

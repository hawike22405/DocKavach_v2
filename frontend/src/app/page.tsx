"use client";

import { Activity, ArrowUpRight, BadgeCheck, Clock3, FileCheck2, LockKeyhole, ScanLine, ShieldCheck, UserRoundCheck, Sparkles, Landmark } from "lucide-react";
import { Card, CardHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DocumentUploader } from "@/components/domain/DocumentUploader";
import { FaceCapture } from "@/components/domain/FaceCapture";
import { ProcessingStepper } from "@/components/domain/ProcessingStepper";
import { ResultsView } from "@/components/domain/ResultsView";
import { CTOsGlobe } from "@/components/domain/CTOsGlobe";
import { useScanStore } from "@/store/useScanStore";
import { recordDecision, screenDocument } from "@/lib/api";
import type { DocumentType, OfficerDecision } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import clsx from "clsx";
import { useState } from "react";

const DOCUMENT_TYPES: { value: DocumentType; label: string; hint: string }[] = [
  { value: "PASSPORT", label: "Passport", hint: "MRZ supported" },
  { value: "VISA", label: "Visa", hint: "Field extraction" },
  { value: "NATIONAL_ID", label: "National ID", hint: "Field extraction" },
];

export default function DashboardPage() {
  const { officer } = useAuthStore();
  const { stage, documentType, documentImage, liveFaceImage, processingStepIndex, result, officerDecision, setDocumentType, setDocumentImage, setLiveFaceImage, startProcessing, setProcessingStep, setResult, setOfficerDecision, resetSession } = useScanStore();
  const [error, setError] = useState<string | null>(null);
  const [savingDecision, setSavingDecision] = useState(false);

  const runScreening = async () => {
    if (!documentImage || !liveFaceImage) return;
    setError(null); startProcessing();
    try {
      const response = await screenDocument({ documentImageBase64: documentImage, documentType, liveFaceBase64: liveFaceImage }, setProcessingStep);
      setProcessingStep(3); setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Screening request failed"); resetSession();
    }
  };

  const handleDecision = async (decision: OfficerDecision) => {
    if (!result || savingDecision) return;
    setSavingDecision(true); setError(null);
    try { await recordDecision(result.transactionId, decision); setOfficerDecision(decision); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not save officer decision"); }
    finally { setSavingDecision(false); }
  };

  return <div className="ctos-dashboard">
    <section className="ctos-hero" id="overview">
      <div className="ctos-hero-copy">
        <div className="ctos-command-line"><span className="ctos-live-dot" /> CT-OS // NATIONAL IDENTITY SCREENING</div>
        <h1>Identity screening with <span>confidence and clarity.</span></h1>
        <p>Review document evidence through a single, explainable workflow. CT-OS combines OCR, document validation, integrity analysis and face correspondence while keeping the final disposition with an authorized officer.</p>
        <div className="ctos-hero-actions"><a href="#screening" className="ctos-primary-link"><ScanLine size={16} /> Start screening <ArrowUpRight size={15} /></a><div className="ctos-classification"><LockKeyhole size={13} /> AUTHORIZED USE · AUDIT LOGGED</div></div>
      </div>
      <div className="ctos-globe-stage"><div className="ctos-globe-label label-top">NATIONAL OPERATIONS · <span>LIVE</span></div><CTOsGlobe /><div className="ctos-globe-label label-bottom">INDIA · SECURE OPERATIONS</div></div>
    </section>

    <section className="ctos-metrics" aria-label="System status">
      {[[ShieldCheck, "SECURE CHANNEL", "SECURE / ONLINE"], [FileCheck2, "SCREENING CORE", "4 CHECKS READY"], [UserRoundCheck, "OFFICER SESSION", officer?.name ?? "AUTHORIZED"], [Clock3, "AUDIT TRAIL", "REAL-TIME"]].map(([Icon, title, value]) => { const I = Icon as typeof ShieldCheck; return <div className="ctos-metric" key={title as string}><I size={17} /><div><b>{title as string}</b><span>{value as string}</span></div><Activity size={13} /></div>; })}
    </section>

    <section id="screening" className="ctos-workspace">
      <div className="ctos-section-heading"><div><span>01 // SCREENING WORKSPACE</span><h2>New identity screening</h2></div><div className="ctos-operation-id">OPERATOR <b>{officer?.badgeId || "UNASSIGNED"}</b></div></div>
      {error && <div role="alert" className="ctos-error">{error}</div>}

      {stage === "capture" && <>
        <div className="ctos-document-selector">
          <div><span>DOCUMENT CLASS</span><strong>Select the evidence type to analyze</strong></div>
          <div className="cyber-tabs" role="radiogroup" aria-label="Document type">
            {DOCUMENT_TYPES.map((option) => <button key={option.value} type="button" role="radio" aria-checked={documentType === option.value} onClick={() => setDocumentType(option.value)} className={clsx("cyber-tab", documentType === option.value && "ctos-tab-active")}><b>{option.label}</b><small>{option.hint}</small></button>)}
          </div>
        </div>
        <div className="ctos-evidence-grid">
          <Card className="ctos-evidence-card"><div className="ctos-card-index">01</div><CardHeading title="Document evidence" description={documentType === "PASSPORT" ? "Passport photo page with MRZ fully visible" : documentType === "VISA" ? "Visa page with all printed fields visible" : "National identity card, front side"} /><DocumentUploader imageUrl={documentImage} onChange={setDocumentImage} /></Card>
          <Card className="ctos-evidence-card"><div className="ctos-card-index">02</div><CardHeading title="Live face capture" description="Current facial image for correspondence analysis" /><FaceCapture imageUrl={liveFaceImage} onChange={setLiveFaceImage} /></Card>
        </div>
        <div className="ctos-submit-bar"><div><BadgeCheck size={17} /><span>Two-source evidence is required before analysis can begin.</span></div><Button variant="primary" disabled={!documentImage || !liveFaceImage} onClick={runScreening}><ScanLine size={16} /> Execute screening</Button></div>
      </>}

      {stage === "processing" && <ProcessingStepper currentStepIndex={processingStepIndex} />}
      {stage === "results" && result && <ResultsView result={result} documentImage={documentImage} liveFaceImage={liveFaceImage} decision={officerDecision} onDecision={handleDecision} onNewScan={resetSession} decisionDisabled={savingDecision} />}
    </section>

    <footer className="ctos-footer"><span>CT-OS // IDENTITY SCREENING</span><span><Sparkles size={10} style={{display:"inline", marginRight:5}} /> EXPLAINABLE OPERATIONS INTERFACE</span><span>BUILD 2026.09</span></footer>
  </div>;
}

"use client";

import type { ScreeningResponse, OfficerDecision } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, CardHeading } from "@/components/ui/Card";
import { RiskGauge } from "@/components/domain/RiskGauge";
import { OcrTable } from "@/components/domain/OcrTable";
import { TamperingViewer } from "@/components/domain/TamperingViewer";
import { FaceMatchCard } from "@/components/domain/FaceMatchCard";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ShieldAlert, UserCheck } from "lucide-react";

export function ResultsView({ result, documentImage, liveFaceImage, decision, onDecision, onNewScan, decisionDisabled = false }: {
  result: ScreeningResponse;
  documentImage: string | null;
  liveFaceImage: string | null;
  decision: OfficerDecision | null;
  onDecision: (decision: OfficerDecision) => void;
  onNewScan: () => void;
  decisionDisabled?: boolean;
}) {
  const isReject = result.recommendation === "REJECT";
  const isReview = result.recommendation === "REVIEW";

  return (
    <div className="result-stack">
      <Card className={`decision-banner ${isReject ? "decision-banner-danger" : isReview ? "decision-banner-review" : "decision-banner-success"}`}>
        <div className="decision-banner-icon">
          {isReject ? <ShieldAlert size={28} /> : isReview ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
        </div>
        <div className="decision-banner-copy">
          <span className="decision-eyebrow">AI SCREENING RECOMMENDATION</span>
          <h2>{result.recommendation}</h2>
          <p>{isReject ? "The screening engine found one or more material verification issues." : isReview ? "The screening engine found items that require an officer review." : "The configured screening checks passed."}</p>
          <small>{result.transactionId} · {new Date(result.timestamp).toLocaleString()}</small>
        </div>
        <RiskGauge score={result.overallRiskScore} recommendation={result.recommendation} />
      </Card>

      <Card className="reason-card">
        <div className="reason-heading"><ClipboardCheck size={19} /><div><CardHeading title="Why this recommendation?" description="Explainable signals returned by the screening pipeline" /></div></div>
        <div className="reason-list">
          {result.recommendationReasons.map((reason, index) => (
            <div className="reason-item" key={`${reason}-${index}`}><span>{index + 1}</span><p>{reason}</p></div>
          ))}
        </div>
        <div className="human-review-note"><UserCheck size={16} /><span>Final identity/access disposition remains with the authorized officer. The AI recommendation is decision support, not an autonomous denial.</span></div>
      </Card>

      <div className="result-grid">
        <Card><CardHeading title="Identity data" description="Fields extracted from the submitted document" /><OcrTable fields={result.module1_OCR} /></Card>
        <Card><CardHeading title="Face correspondence" description="Document portrait compared with live capture" /><FaceMatchCard documentPhoto={documentImage} livePhoto={liveFaceImage} matchPercentage={result.module4_FaceMatch.matchPercentage} isMatch={result.module4_FaceMatch.isMatch} /></Card>
        <Card><CardHeading title="Document validation" description="Validity and consistency checks" />
          <div className="validation-summary">
            <p className={result.module2_Validation.isValid ? "status-success" : "status-danger"}>{result.module2_Validation.isValid ? "Document checks passed" : "Document checks require attention"}</p>
            {result.module2_Validation.errors.length === 0 ? <p className="muted-copy">No validation issues reported.</p> : result.module2_Validation.errors.map((error) => <p className="validation-error" key={error}>{error}</p>)}
          </div>
        </Card>
        <Card><CardHeading title="Document integrity" description="Anomalies identified by the analysis module" /><TamperingViewer documentImage={documentImage} validation={result.module2_Validation} tampering={result.module3_Tampering} /></Card>
      </div>

      <Card className="officer-decision-card">
        <div className="officer-decision-header"><div><span className="decision-eyebrow">AUTHORIZED OFFICER ACTION</span><h3>Confirm screening disposition</h3><p>Record the final action after reviewing the evidence and AI explanation.</p></div><UserCheck size={25} /></div>
        <div className="decision-actions">
          {(["APPROVE", "FLAG", "REJECT"] as const).map((option) => (
            <Button key={option} variant={decision === option ? "primary" : "ghost"} onClick={() => onDecision(option)} disabled={decisionDisabled}>{option}</Button>
          ))}
          <div className="decision-new"><Button variant="ghost" onClick={onNewScan} disabled={decisionDisabled}>New screening</Button></div>
        </div>
        {decision && <p className="recorded-decision"><CheckCircle2 size={14} /> Recorded officer decision: <b>{decision}</b></p>}
      </Card>
    </div>
  );
}

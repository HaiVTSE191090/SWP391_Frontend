import React, { useState } from "react";
import ManualIdentityForm from "../components/indentity/ManualIdentityForm";
import OcrIdentityForm from "../components/indentity/OcrForm";

export default function ManualIdentityPage() {
  const [mode, setMode] = useState<"ocr" | "manual">("ocr");
  

  return (
    <div> 
      {mode === "ocr" ? (
        <OcrIdentityForm onSwitchToManual={() => setMode("manual")} />
      ) : (
        <ManualIdentityForm onSwitchToOcr={() => setMode("ocr")} />
      )}
    </div>
  );
}

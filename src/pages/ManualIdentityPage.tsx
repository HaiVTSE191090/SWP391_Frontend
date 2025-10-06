import React, { useState } from "react";
import ManualIdentityForm from "../components/indentity/ManualIdentityForm";
import OcrIdentityForm from "../components/indentity/OcrForm";

export default function ManualIdentityPage() {
  const [mode, setMode] = useState<"ocr" | "manual">("ocr");
  
// sau này có thể để cái này là popup trong trang cá nhân

  return (
    <div> 
      {mode === "ocr" ? (
        <OcrIdentityForm onSwitchToManual={() => setMode("manual")} />
      ) : (
        <ManualIdentityForm />
      )}
    </div>
  );
}

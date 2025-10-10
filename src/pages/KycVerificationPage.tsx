import React from "react";
import KycVerification from "../components/kyc/KycVerification";

const KycVerificationPage: React.FC = () => {
    return (
        <div className="min-vh-100 bg-light">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <KycVerification />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KycVerificationPage;

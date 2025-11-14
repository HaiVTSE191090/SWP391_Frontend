// Model cho KYC Verification Request
export interface KycVerificationRequest {
  renterId: number;
  nationalId: string;           
  nationalName: string;         
  nationalDob: string;          
  nationalAddress: string;      
  nationalIssueDate?: string;    
  nationalExpireDate: string;   
  driverLicense: string;        
  driverName: string
  driverAddress: string;        
  driverClass: string;          
  driverIssueDate?: string;      
  driverExpireDate: string;     
  confidenceScore: number;      
}

// Model cho OCR Response từ FPT AI
export interface OcrCCCDData {
  id: string;                   
  name: string;                 
  dob: string;                  
  sex: string;
  nationality: string;          
  home: string;                 
  address: string;              
  doe: string;                  
  issue_date: string;           
  issue_loc: string;            
  overall_score: number;        
  id_prob: number;
  name_prob: number;
  dob_prob: number;
  sex_prob: number;
  nationality_prob: number;
}

export interface OcrGPLXData {
  id: string;                   
  name: string;                 
  dob: string;                   
  class: string;                
  address: string;              
  doe: string;                   
  issue_date: string;            
  overall_score: number;        
}

// Response từ API KYC
export interface KycVerificationResponse {
  status: "success" | "error";
  code: number;
  message: string;
  data?: any;
}


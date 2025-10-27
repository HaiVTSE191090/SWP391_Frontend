export interface Booking {
  bookingId: number;              
  renterId: number;              
  renterName: string;             
  vehicleId: number;              
  vehicleName: string;            
  staffId: number;                
  staffName: string;              
  priceSnapshotPerHour: number;   
  priceSnapshotPerDay: number;    
  startDateTime: string;         
  endDateTime: string;            
  actualReturnTime?: string | null; 
  totalAmount: number;           
  status: string;                
  depositStatus: string;          
  createdAt: string;             
  updatedAt?: string | null;  
}
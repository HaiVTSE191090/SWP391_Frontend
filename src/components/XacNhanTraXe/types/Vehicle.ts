export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
  status: 'waiting_return' | 'returned' | 'in_use';
  handoverInfo: {
    images: string[];
    battery: number;
    mileage: number;
    handoverDate: string;
    notes?: string;
  };
  returnInfo?: {
    images: string[];
    battery: number;
    mileage: number;
    returnDate: string;
    condition: VehicleCondition;
    additionalFees: AdditionalFee[];
    notes?: string;
    staffId: string;
  };
}

export interface VehicleCondition {
  exterior: 'good' | 'minor_damage' | 'major_damage';
  battery: 'good' | 'low' | 'very_low';
  mileage: 'normal' | 'high';
  overall: 'good' | 'needs_maintenance' | 'damaged';
}

export interface AdditionalFee {
  id: string;
  type: 'damage' | 'cleaning' | 'fuel' | 'other';
  amount: number;
  description: string;
}

// New interfaces for Renter
export interface Rental {
  id: string;
  vehicle: Vehicle;
  renterInfo: {
    name: string;
    phone: string;
    idCard: string;
  };
  rentalInfo: {
    startDate: string;
    endDate: string;
    dailyRate: number;
    deposit: number;
    totalDays: number;
  };
  status: 'pending_payment' | 'paid' | 'disputed';
  costBreakdown?: CostBreakdown;
}

export interface CostBreakdown {
  baseCost: number;
  additionalFees: AdditionalFee[];
  deposit: number;
  totalAdditionalFees: number;
  finalAmount: number; // baseCost + additionalFees - deposit
}
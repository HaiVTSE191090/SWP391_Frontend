export interface ApiResponse<T> {
    status: string,
    code: number,
    data: T,
    message: string
}
export interface PolicyResponse {
  policyId: number;
  policyType: string;
  description: string;
  value: number;
  appliedScope: string;
  status: string;
}

export type PolicyType =
  | "REFUND_PERCENT_RENTER"
  | "MIN_DAYS_BEFORE_BOOKING"
  | "MAX_DAYS_BEFORE_BOOKING"
  | "DEPOSIT_AMOUNT"
  | "RENTAL_TIME_THRESHOLD_HOURS"
  | "VEHICLE_HOLD_DAYS_AFTER_BOOKING"
  | "MAX_RENTAL_DAYS";


import { useCallback, useState } from "react";
import { PolicyResponse, PolicyType } from "../models/PolicyModel";
import api from "../services/apiClient";
import { ApiResponse } from "../models/AuthModel";

export function usePolicy() {
  const [policy, setPolicy] = useState<PolicyResponse>();
  const [policies, setPolicies] = useState<PolicyResponse[]>([]);
  const [error, setError] = useState<string>("");

  const loadAllPolicies = useCallback(async () => {
    setError("");
    try {
      const res = await api.get<ApiResponse<PolicyResponse[]>>("/api/policies");
      setPolicies(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.data || "Không thể tải danh sách policy");
    }
  }, []);

  const loadPolicyById = useCallback(async (policyId: number) => {
    setError("");
    try {
      const res = await api.get<ApiResponse<PolicyResponse>>(
        `api/policies/${policyId}`
      );
      setPolicy(res.data.data);
      return res.data.data;
    } catch (err: any) {
      console.error("Failed to load policy:", err);
      setError(err.response?.data?.data || "Không thể tải policy");
    }
  }, []);

  const getPolicyAcitveByPolicyType = useCallback(async (policyType: PolicyType) => {
    setError("");
    try {
      const res = await api.get<ApiResponse<PolicyResponse>>(`/api/policies/active/${policyType}`);
      return {
        success: true,
        data: res.data.data
      }
    } catch (error: any) {
      return{
        success: false,
        err: error.response?.data.data
      }
      
    }
  }, []);

  const fetchPolicyDay = useCallback(async () => {
    const res = await getPolicyAcitveByPolicyType("MIN_DAYS_BEFORE_BOOKING");
    const res2 = await getPolicyAcitveByPolicyType("MAX_DAYS_BEFORE_BOOKING");
    const res3 = await getPolicyAcitveByPolicyType("MAX_RENTAL_DAYS");
    return {
      minStartDay: res?.data?.value,
      maxStartDay: res2?.data?.value,
      maxEndDay: res3?.data?.value
    };
  }, [getPolicyAcitveByPolicyType]);

  const fetchPolicDeposit = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<PolicyResponse>>(`/api/policies/active/DEPOSIT_AMOUNT`);
      return{
        success: true,
        value: res.data.data.value
      }
    } catch (error:any) {
      return{
        success: false,
        err: error.response?.data.data
      }
    }
  }, [])

  return {
    policy,
    policies,
    error,
    loadAllPolicies,
    loadPolicyById,
    fetchPolicyDay,
    getPolicyAcitveByPolicyType,
    fetchPolicDeposit,

  };
}

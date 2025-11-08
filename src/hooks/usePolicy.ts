import { useCallback, useState } from "react";
import { PolicyResponse, PolicyType } from "../models/PolicyModel";
import api from "../services/apiClient";
import { ApiResponse } from "../models/AuthModel";
import { data } from "react-router-dom";

export function usePolicy() {
  const [policy, setPolicy] = useState<PolicyResponse>();
  const [policies, setPolicies] = useState<PolicyResponse[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadAllPolicies = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<PolicyResponse[]>>("/api/policies");
      setPolicies(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.data || "Không thể tải danh sách policy");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPolicyById = useCallback(async (policyId: number) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<PolicyResponse>>(
        `api/policies/${policyId}`
      );
      setPolicy(res.data.data);
    } catch (err: any) {
      console.error("Failed to load policy:", err);
      setError(err.response?.data?.data || "Không thể tải policy");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPolicyAcitveByPolicyType = useCallback(
    async (policyType: PolicyType) => {
      setError("");
      try {
        const res = await api.get<ApiResponse<PolicyResponse>>(
          `/api/policies/active/${policyType}`
        );
        return {
          success: true,
          data: res.data.data,
        };
      } catch (error: any) {
        return {
          success: false,
          err: error.response?.data.data,
        };
      }
    },
    []
  );

  const fetchPolicyDay = useCallback(async () => {
    const res = await getPolicyAcitveByPolicyType("MIN_DAYS_BEFORE_BOOKING");
    const res2 = await getPolicyAcitveByPolicyType("MAX_DAYS_BEFORE_BOOKING");
    const res3 = await getPolicyAcitveByPolicyType("MAX_RENTAL_DAYS");
    return {
      minStartDay: res?.data?.value,
      maxStartDay: res2?.data?.value,
      maxEndDay: res3?.data?.value,
    };
  }, [getPolicyAcitveByPolicyType]);

  const fetchPolicDeposit = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<PolicyResponse>>(
        `/api/policies/active/DEPOSIT_AMOUNT`
      );
      return {
        success: true,
        value: res.data.data.value,
      };
    } catch (error: any) {
      return {
        success: false,
        err: error.response?.data.data,
      };
    }
  }, []);

  const setPolicyById = async (
    policyId: number,
    updatedData: PolicyResponse
  ) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.put<ApiResponse<PolicyResponse>>(
        `/api/policies/${policyId}`,
        { updatedData }
      );
      if (res.data.status === "success") {
        return {
          success: true,
          data: res.data.data,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        err: error.response?.data.data,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deletePolicyById = async (policyId: number) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.delete(`/api/policies/${policyId}`);
      if (res.data.status) {
        return {
          success: true,
          message: res.data.message,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data.data,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const createPolicy = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post(`/api/policies`);
      if (res.data.status === "success"){
        return{
          success: true,
          data: res.data.data
        }
      }
    } catch (error: any) {
      return{
        success: false,
        message: error.response?.data.message
      }
    } finally {
      setIsLoading(false)
    }
  };

  return {
    policy,
    policies,
    error,
    isLoading,
    loadAllPolicies,
    loadPolicyById,
    fetchPolicyDay,
    getPolicyAcitveByPolicyType,
    fetchPolicDeposit,
    setPolicyById,
    deletePolicyById,
    createPolicy,
  };
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Policy {
  id: string;
  policyNumber: string;
  customerName: string;
  policyType: string;
  premium: number;
  netPremium: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
}

interface PolicyState {
  policies: Policy[];
  loading: boolean;
  dashboardStats: {
    totalPolicies: number;
    totalPremium: number;
    totalNetPremium: number;
    monthlyData: Array<{ month: string; policies: number; premium: number }>;
  };
}

const initialState: PolicyState = {
  policies: [
    {
      id: '1',
      policyNumber: 'POL001',
      customerName: 'Alice Johnson',
      policyType: 'Life Insurance',
      premium: 15000,
      netPremium: 14000,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      status: 'active',
    },
    {
      id: '2',
      policyNumber: 'POL002',
      customerName: 'Bob Wilson',
      policyType: 'Health Insurance',
      premium: 25000,
      netPremium: 23000,
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      status: 'active',
    },
  ],
  loading: false,
  dashboardStats: {
    totalPolicies: 156,
    totalPremium: 2850000,
    totalNetPremium: 2650000,
    monthlyData: [
      { month: 'Apr', policies: 12, premium: 180000 },
      { month: 'May', policies: 18, premium: 275000 },
      { month: 'Jun', policies: 15, premium: 220000 },
      { month: 'Jul', policies: 22, premium: 340000 },
      { month: 'Aug', policies: 19, premium: 290000 },
      { month: 'Sep', policies: 25, premium: 380000 },
      { month: 'Oct', policies: 28, premium: 420000 },
      { month: 'Nov', policies: 20, premium: 310000 },
      { month: 'Dec', policies: 24, premium: 360000 },
      { month: 'Jan', policies: 30, premium: 450000 },
      { month: 'Feb', policies: 26, premium: 390000 },
      { month: 'Mar', policies: 32, premium: 480000 },
    ],
  },
};

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    addPolicy: (state, action: PayloadAction<Omit<Policy, 'id'>>) => {
      const newPolicy = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.policies.push(newPolicy);
    },
    updatePolicy: (state, action: PayloadAction<Policy>) => {
      const index = state.policies.findIndex(policy => policy.id === action.payload.id);
      if (index !== -1) {
        state.policies[index] = action.payload;
      }
    },
    deletePolicy: (state, action: PayloadAction<string>) => {
      state.policies = state.policies.filter(policy => policy.id !== action.payload);
    },
  },
});

export const { addPolicy, updatePolicy, deletePolicy } = policySlice.actions;
export default policySlice.reducer;
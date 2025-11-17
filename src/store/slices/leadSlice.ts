import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  assignedTo: string;
  createdDate: string;
  notes: string;
}

interface LeadState {
  leads: Lead[];
  loading: boolean;
}

const initialState: LeadState = {
  leads: [
    {
      id: '1',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1234567892',
      source: 'Website',
      status: 'new',
      assignedTo: 'John Doe',
      createdDate: '2024-01-15',
      notes: 'Interested in life insurance',
    },
    {
      id: '2',
      name: 'Sarah Davis',
      email: 'sarah@example.com',
      phone: '+1234567893',
      source: 'Referral',
      status: 'contacted',
      assignedTo: 'Jane Smith',
      createdDate: '2024-01-18',
      notes: 'Looking for health insurance for family',
    },
  ],
  loading: false,
};

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    addLead: (state, action: PayloadAction<Omit<Lead, 'id'>>) => {
      const newLead = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.leads.push(newLead);
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
    deleteLead: (state, action: PayloadAction<string>) => {
      state.leads = state.leads.filter(lead => lead.id !== action.payload);
    },
  },
});

export const { addLead, updateLead, deleteLead } = leadSlice.actions;
export default leadSlice.reducer;
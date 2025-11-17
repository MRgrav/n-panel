import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joinDate: string;
  status: 'current' | 'ex';
  phone: string;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
}

const initialState: EmployeeState = {
  employees: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Sales',
      designation: 'Manager',
      joinDate: '2023-01-15',
      status: 'current',
      phone: '+1234567890',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      department: 'Underwriting',
      designation: 'Executive',
      joinDate: '2023-03-20',
      status: 'current',
      phone: '+1234567891',
    },
  ],
  loading: false,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Omit<Employee, 'id'>>) => {
      const newEmployee = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.employees.push(newEmployee);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
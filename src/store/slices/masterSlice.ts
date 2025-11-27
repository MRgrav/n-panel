import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentMode {
    id: string;
    paymentModeName: string;
    status: "active" | "inactive";
}

interface Department {
    id: string;
    department: string;
    status: "active" | "inactive";
}

interface Subject {
    id: string;
    subject: string;
    status: "active" | "inactive";
}

interface Designation {
    id: string;
    designation: string;
    status: "active" | "inactive";
}

interface MasterState {
    paymentModes: PaymentMode[];
    departments: Department[];
    subjects: Subject[];
    designations: Designation[];
    loading: boolean;
}

const initialState: MasterState = {
    paymentModes: [
        { id: "1", paymentModeName: "Cash", status: "active" },
        { id: "2", paymentModeName: "Bank Transfer", status: "active" },
        { id: "3", paymentModeName: "Credit Card", status: "active" },
    ],
    departments: [
        { id: "1", department: "Sales", status: "active" },
        { id: "2", department: "Underwriting", status: "active" },
        { id: "3", department: "Claims", status: "active" },
    ],
    subjects: [
        { id: "1", subject: "Maths", status: "active" },
        { id: "2", subject: "English", status: "active" },
        { id: "3", subject: "Hindi", status: "active" },
    ],
    designations: [
        { id: "1", designation: "Manager", status: "active" },
        { id: "2", designation: "Executive", status: "active" },
        { id: "3", designation: "Assistant", status: "active" },
    ],
    loading: false,
};

const masterSlice = createSlice({
    name: "master",
    initialState,
    reducers: {
        addPaymentMode: (
            state,
            action: PayloadAction<Omit<PaymentMode, "id">>
        ) => {
            const newMode = {
                ...action.payload,
                id: Date.now().toString(),
            };
            state.paymentModes.push(newMode);
        },
        updatePaymentMode: (state, action: PayloadAction<PaymentMode>) => {
            const index = state.paymentModes.findIndex(
                (mode) => mode.id === action.payload.id
            );
            if (index !== -1) {
                state.paymentModes[index] = action.payload;
            }
        },
        deletePaymentMode: (state, action: PayloadAction<string>) => {
            state.paymentModes = state.paymentModes.filter(
                (mode) => mode.id !== action.payload
            );
        },

        addDepartment: (
            state,
            action: PayloadAction<Omit<Department, "id">>
        ) => {
            const newDepartment = {
                ...action.payload,
                id: Date.now().toString(),
            };
            state.departments.push(newDepartment);
        },
        updateDepartment: (state, action: PayloadAction<Department>) => {
            const index = state.departments.findIndex(
                (dept) => dept.id === action.payload.id
            );
            if (index !== -1) {
                state.departments[index] = action.payload;
            }
        },
        deleteDepartment: (state, action: PayloadAction<string>) => {
            state.departments = state.departments.filter(
                (dept) => dept.id !== action.payload
            );
        },

        addSubject: (
            state,
            action: PayloadAction<Omit<Subject, "id">>
        ) => {
            const newSubject = {
                ...action.payload,
                id: Date.now().toString(),
            };
            state.subjects.push(newSubject);
        },
        updateSubject: (state, action: PayloadAction<Subject>) => {
            const index = state.subjects.findIndex(
                (sub) => sub.id === action.payload.id
            );
            if (index !== -1) {
                state.subjects[index] = action.payload;
            }
        },
        deleteSubject: (state, action: PayloadAction<string>) => {
            state.subjects = state.subjects.filter(
                (sub) => sub.id !== action.payload
            );
        },

        addDesignation: (
            state,
            action: PayloadAction<Omit<Designation, "id">>
        ) => {
            const newDesignation = {
                ...action.payload,
                id: Date.now().toString(),
            };
            state.designations.push(newDesignation);
        },
        updateDesignation: (state, action: PayloadAction<Designation>) => {
            const index = state.designations.findIndex(
                (desig) => desig.id === action.payload.id
            );
            if (index !== -1) {
                state.designations[index] = action.payload;
            }
        },
        deleteDesignation: (state, action: PayloadAction<string>) => {
            state.designations = state.designations.filter(
                (desig) => desig.id !== action.payload
            );
        },
    },
});

export const {
    //payment
    addPaymentMode,
    updatePaymentMode,
    deletePaymentMode,

    //department
    addDepartment,
    updateDepartment,
    deleteDepartment,

    //subjects
    addSubject,
    updateSubject,
    deleteSubject,
    
    //designation
    addDesignation,
    updateDesignation,
    deleteDesignation,
} = masterSlice.actions;

export default masterSlice.reducer;

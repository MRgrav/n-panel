// types/student.ts
export interface Student {
    id: string;
    rollNumber: string;
    fullName: string;
    email: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    previousSchool: string;
    previousClass: string;
    previousGrade: string;
    promotedToClass: string;
    admissionAmount: number;
    monthlyFees: number;
    admissionDate: string;
    admissionReceiptNo: string;
    admissionReceipt?: File;
    status: 'active' | 'inactive';
    type: 'new' | 'existing';
  }
  
  export interface StudentFormData {
    type: 'new' | 'existing';
    existingRollNumber?: string;
    fullName: string;
    email: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    previousSchool: string;
    previousClass: string;
    previousGrade: string;
    promotedToClass: string;
    admissionAmount: number;
    monthlyFees: number;
    admissionDate: string;
    admissionReceiptNo: string;
    admissionReceipt?: File;
  }
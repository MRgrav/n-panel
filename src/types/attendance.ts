
export interface AttendanceRecord {
    id: string;
    studentId: string;
    rollNo: string;
    studentName: string;
    classId: string;
    className: string;
    subjectId?: string;
    subjectName?: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
    markedBy: string;
    markedAt: string;
    remarks?: string;
  }
  
  export interface Student {
    id: string;
    rollNo: string;
    name: string;
    classId: string;
    className: string;
    avatar?: string;
    status?: 'active' | 'inactive';
  }
  
  export interface Class {
    id: string;
    name: string;
    section?: string;
    totalStudents: number;
  }
  
  export interface Subject {
    id: string;
    name: string;
    code: string;
    teacherId: string;
  }
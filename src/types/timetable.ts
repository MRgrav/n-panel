export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    type: 'class' | 'break' | 'lunch' | 'activity';
    className?: string;
  }
  
  export interface DaySchedule {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    date?: string;
    isHalfDay?: boolean;
    timeSlots: TimeSlot[];
  }
  
  export interface ClassTimetable {
    classId: string;
    className: string;
    schedule: DaySchedule[];
  }
  
  export interface TimetableFilters {
    selectedClass: string;
    viewMode: 'weekly' | 'daily';
    selectedDay?: string;
  }
import Attendance from "../pages/attendance/Attendance";
import Dashboard from "../pages/Dashboard";
import AddEmployee from "../pages/employee/AddEmployee";
import CurrentEmployees from "../pages/employee/CurrentEmployees";
import EditEmployee from "../pages/employee/EditEmployee";
import ExEmployees from "../pages/employee/ExEmployees";
import Classes from "../pages/master/Classes";
import Departments from "../pages/master/Departments";
import Designations from "../pages/master/Designations";
import Subjects from "../pages/master/Subjects";
import Students from "../pages/students/Students";
import Timetable from "../pages/timeTable/Timetable";

export const protectedRoutes = [
  {
    path: 'dashboard',
    element: <Dashboard />,
    roles: ['ADMIN'], 
  },
  {
    path: 'students',
    element: <Students />,
    roles: ['ADMIN'], 
  },
  {
    path: 'timetable',
    element: <Timetable />,
    roles: ['ADMIN', 'Director'],
  },
  {
    path: 'master/departments',
    element: <Departments />,
    roles: ['ADMIN', 'Director'],
  },
  {
    path: 'master/subjects',
    element: <Subjects />,
    roles: ['ADMIN', 'Director'],
  },
  {
    path: 'master/classes',
    element: <Classes />,
    roles: ['ADMIN', 'Director'],
  },
  // {
  //   path: 'master/designations',
  //   element: <Designations />,
  //   roles: ['ADMIN', 'Director'],
  // },
  {
    path: 'employee/',
    element: <CurrentEmployees />,
    roles: ['ADMIN', 'Director'],
  },
  {
    path: 'employee/add',
    element: <AddEmployee />,
    roles: ['ADMIN', 'Director'],
  },
  {
    path: 'employee/edit/:id',
    element: <EditEmployee />,
    roles: ['ADMIN', 'Director'],
  },
  {
    path: 'attendance',
    element: <Attendance />,
    roles: ['ADMIN', 'Teacher'],
  },
];

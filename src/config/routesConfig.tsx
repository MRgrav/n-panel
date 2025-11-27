import Dashboard from "../pages/Dashboard";
import AddEmployee from "../pages/employee/AddEmployee";
import CurrentEmployees from "../pages/employee/CurrentEmployees";
import EditEmployee from "../pages/employee/EditEmployee";
import ExEmployees from "../pages/employee/ExEmployees";
import Departments from "../pages/master/Departments";
import Designations from "../pages/master/Designations";
import PaymentModes from "../pages/master/PaymentModes";
import Subjects from "../pages/master/Subjects";

export const protectedRoutes = [
  {
    path: 'dashboard',
    element: <Dashboard />,
    roles: ['ADMIN'], 
  },
  {
    path: 'master/payment-modes',
    element: <PaymentModes />,
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
    path: 'master/designations',
    element: <Designations />,
    roles: ['ADMIN', 'Director'],
  },
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
    path: 'ex-employee',
    element: <ExEmployees />,
    roles: ['ADMIN', 'Director'],
  },

];

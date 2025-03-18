import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Nav from './Components/Nav'
import RegistrationNav from './Components/RegistrationNav'
import Navigation from './Components/PatientNavigation'
import DocNavigation from './Components/DoctorNavigation'

import Login from './Pages/Login'
import Registration from './Pages/Registration'
import PatientRegistrationForm from './Components/PatientRegistration'
import DoctorRegistrationForm from './Components/Registration/DoctorRegistration'
import AssistantRegistrationForm from './Components/Registration/AssistantRegistration'

import PatientLogin from './Components/Login/PatientLogin'
import DoctorLogin from './Components/Login/DoctorLogin'
import AssistantLogin from './Components/Login/AssistantLogin'

import PatientDashboard from './Pages/Patient/PatientDashboard'
import PatientFamilyPage from './Pages/Patient/PatientFamilyPage'
import PatientDoctorPage from './Pages/Patient/PatientDoctorPage'
import PatientGuide from './Pages/Patient/PatientGuide'
import DoctorDashbord from './Pages/Doctor/DoctorDashbord'
import PatientFamily from './Pages/Doctor/PatientFamily'
import DoctorGuide from './Pages/Doctor/DoctorGuide'

import PatientAddMemPage from './Pages/Patient/PatientAddMemPage'
import FamilyMembers from './Components/Patient/PatientFamilyMem'
import PatientAddNewFamilyMember from './Components/Patient/PatientAddNewMem'
import HealthDocuments from './Components/Patient/PatientHealthDocument' // ✅ New Import

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  { path: "/", element: <><Nav /><Login /></> },
  { path: "/registration", element: <><RegistrationNav /><Registration /></> },
  { path: "/PatientRegistration", element: <><RegistrationNav /><PatientRegistrationForm /></> },
  { path: "/PatientFamilyMembers", element: <><Navigation /><FamilyMembers /></> },
  { path: "/edit-family-member/:id", element: <><Navigation /><PatientAddNewFamilyMember /></> },
  { path: "/add-new-family-member", element: <><Navigation /><PatientAddNewFamilyMember /></> },
  { path: "/DoctorRegistration", element: <><RegistrationNav /><DoctorRegistrationForm /></> },
  { path: "/AssistantRegistration", element: <><RegistrationNav /><AssistantRegistrationForm /></> },
  { path: "/PatientFamilyPage", element: <><Navigation /><PatientFamilyPage /></> },
  { path: "/PatientAddMemPage", element: <><Navigation /><PatientAddMemPage /></> },
  { path: "/PatientDoctorPage", element: <><Navigation /><PatientDoctorPage /></> },
  { path: "/DoctorLogin", element: <><Nav /><DoctorLogin /></> },
  { path: "/PatientLogin", element: <><Nav /><PatientLogin /></> },
  { path: "/AssistantLogin", element: <><Nav /><AssistantLogin /></> },
  { path: "/PatientDashboard", element: <><Navigation /><PatientDashboard /></> },
  { path: "/PatientGuide", element: <><Navigation /><PatientGuide /></> },
  { path: "/DoctorDashboard", element: <><DocNavigation /><DoctorDashbord /></> },
  { path: "/DoctorFamily", element: <><DocNavigation /><PatientFamily /></> },
  { path: "/DoctorGuide", element: <><DocNavigation /><DoctorGuide /></> },

  // ✅ New Route for Family Member's Health Documents
  {
    path: "/health-documents/:familyId",
    element: (
      <>
        <HealthDocuments />
      </>
    )
  }
]);

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

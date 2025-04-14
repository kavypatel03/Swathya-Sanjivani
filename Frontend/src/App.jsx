import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Nav from './Components/Nav'
import RegistrationNav from './Components/RegistrationNav'
import Navigation from './Components/Patient/PatientNavigation'
import Dashboard from './Pages/Doctor/Dashbord'

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
import PatientDoctorPage from './Pages/Patient/PatientDoctorPage';
import PatientGuide from './Pages/Patient/PatientGuide';
import PatientAddMemPage from './Pages/Patient/PatientAddMemPage';
import AssistantDashbord from './Pages/Assistant/AssistantDashbord';
import AssistantReportPage from './Pages/Assistant/assistantReportPage';
import Guide from './Pages/Assistant/GuidePage';
import DGuide from './Pages/Doctor/Guide';
import Modify from './Pages/Assistant/modifyDetailPage'
import PatientPrescription from './Components/Assistant/patientPrescription';

// Add import for DoctorProfile
import DoctorProfile from './Pages/Doctor/DoctorProfile';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <><Nav /><Login /></> },
    { path: "/registration", element: <><RegistrationNav /><Registration /></> },
    { path: "/PatientRegistration", element: <><RegistrationNav /><PatientRegistrationForm /></> },
    { path: "/DoctorRegistration", element: <><RegistrationNav /><DoctorRegistrationForm /></> },
    { path: "/AssistantRegistration", element: <><RegistrationNav /><AssistantRegistrationForm /></> },
    { path: "/PatientLogin", element: <><Nav /><PatientLogin /></> },
    { path: "/DoctorLogin", element: <><Nav /><DoctorLogin /></> },
    { path: "/AssistantLogin", element: <><Nav /><AssistantLogin /></> },

    // Patient Routes
    { path: "/PatientDashboard", element: <><Navigation /><PatientDashboard /></> },
    { path: "/PatientFamilyPage", element: <><Navigation /><PatientFamilyPage /></> },
    { 
      path: "/PatientDoctorPage", 
      element: <><Navigation /><PatientDoctorPage /> </>,
    },
    { 
      path: "/PatientDoctorPage/:patientId/doctors", 
      element: <><Navigation /><PatientDoctorPage /> </> 
    },
    { 
      path: "/PatientDoctorPage/:patientId/doctors/:doctorId", 
      element: <><Navigation /><PatientDoctorPage /> </> 
    },
    { 
      path: "/PatientDoctorPage/:patientId/doctors", 
      element: <><Navigation /><PatientDoctorPage /> </> 
    },
    { 
      path: "/PatientDoctorPage/:patientId/doctors/:doctorId", 
      element: <><Navigation /><PatientDoctorPage /> </> 
    },
    { path: "/PatientAddMemPage", element: <><Navigation /><PatientAddMemPage /></> },
    { path: "/PatientGuide", element: <><Navigation /><PatientGuide /></> },


    // Doctor Routes
    { path: "/Dashbord", element: <><Dashboard /></>},
    { path: "/Guide", element: <><DGuide /></> },
    // Add DoctorProfile route
    { path: "/DoctorProfile", element: <DoctorProfile /> },
    
    // Assistant Routes
    { path: "/AssistantDashbord", element: <AssistantDashbord /> },
    { path: "/AssistantReportPage", element: <AssistantReportPage /> },
    { path: "/Guide", element: <Guide /> },
    { path: "/modifyDetailPage", element: <Modify /> },
    { path: "/assistant/documents/:category", element: <PatientPrescription /> },
  ]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
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
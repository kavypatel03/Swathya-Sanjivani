import React from 'react'
import Login from './Pages/Login'
import Registration from './Pages/Registration'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Nav from './Components/Nav'
import RegistrationNav from './Components/RegistrationNav'
import PatientRegistrationForm from './Components/PatientRegistration'
import DoctorRegistrationForm from './Components/DoctorRegistration'
import AssistantRegistrationForm from './Components/AssistantRegistration'
import DoctorLogin from'./Components/DoctorLogin'
import PatientLogin from'./Components/PatientLogin'
import AssistantLogin from './Components/AssistantLogin'
import Navigation from './Components/PatientNavigation';
import PatientDashboard from './Pages/PatientDashboard';
import PatientFamilyPage from './Pages/PatientFamilyPage'
import PatientDoctorPage from './Pages/PatientDoctorPage';
import PatientGuide from './Pages/PatientGuide';
import UploadToast from './Components/UploadTost'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Nav />
          <Login />
        </>
      )
    },
    {
      path: "/registration",
      element: (
        <>
          <RegistrationNav />
          <Registration />
        </>
      )
    },
    {
      path: "/PatientRegistration",
      element: (
        <>
          <RegistrationNav />
          <PatientRegistrationForm />
        </>
      )
    },
    {
      path: "/DoctorRegistration",
      element: (
        <>
          <RegistrationNav />
          <DoctorRegistrationForm />
        </>
      )
    },
    {
      path: "/AssistantRegistration",
      element: (
        <>
          <RegistrationNav />
          <AssistantRegistrationForm />
        </>
      )
    },
    {
      path: "/PatientFamilyPage",
      element: (
        <>
          <Navigation />
          <PatientFamilyPage />
        </>
      )
    },
    {
      path: "/PatientDoctorPage",
      element: (
        <>
          <Navigation />
          <PatientDoctorPage />
        </>
      )
    },
    {
      path: "/DoctorLogin",
      element: (
        <>
          <Nav />
          <DoctorLogin />
        </>
      )
    },
    {
      path: "/PatientLogin",
      element: (
        <>
          <Nav />
          <PatientLogin />
        </>
      )
    },
    {
      path: "/AssistantLogin",
      element: (
        <>
          <Nav />
          <AssistantLogin />
        </>
      )
    },
    {
      path: "/PatientDashboard",
      element: (
        <>
          <Navigation/>
          <PatientDashboard />
        </>
      )
    },
    {
      path: "/PatientGuide",
      element: (
        <>
          <Navigation/>
          <PatientGuide />
        </>
      )
    },
    {
      path: "/UploadToast",
      element: (
        <>
          <UploadToast />
        </>
      )
    },
  ])
  
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

export default App
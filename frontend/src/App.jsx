import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointment from "./pages/Appointment";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { useContext, useEffect } from "react";
import { Context } from "./main";
import axios from "axios";
import Biography from "./components/Biography";
import AboutUs from "./pages/AboutUs";
import Footer from "./components/Footer";
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const responce = await axios.get(
          `http://localhost:4000/api/v1/user/patient/me`,
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(responce.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
        console.log(error);
      }
    };
    fetchuser();
  }, [isAuthenticated]);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/biography" element={<Biography />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
        <ToastContainer position="top-center" />
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;

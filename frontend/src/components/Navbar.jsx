import { useNavigate, Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useContext, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
function Navbar() {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigate = useNavigate();
  const handleLogOut = async () => {
    await axios
      .get(`http://localhost:4000/api/v1/user/patient/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleLogin = async () => {
    navigate("/login");
  };

  return (
    <div>
      <nav className={"container"}>
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>
              Home
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>
              Appointment
            </Link>
            <Link to={"/about"} onClick={() => setShow(!show)}>
              About Us
            </Link>
          </div>
          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogOut}>
              LOGOUT
            </button>
          ) : (
            <button className="loginBtn btn" onClick={handleLogin}>
              LOGIN
            </button>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </div>
  );
}
export default Navbar;

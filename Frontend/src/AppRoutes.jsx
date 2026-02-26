import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import CounselorDashboard from "./pages/Counselors/CounselorDashboard";
import CoursePagesDashboard from "./pages/Services/CoursePagesDashboard";
import CityTargetDashboard from "./pages/Services/CityTargetDashboard";
import ProtectedCounselorRoute from "./components/ProtectedCounselorRoute";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Popup visibility state
  const [showPopup, setShowPopup] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const hideFooter = location.pathname === "/contact";
  const hideSocialIcons = location.pathname === "/contact" || location.pathname === "/counselors/dashboard";

  const contactInfo = {
    phone: "+91 74156 66361",
    whatsapp: "+917415666361",
    email: "careerguid09@gmail.com",
    address: "Arhedi Road, Shiv City, Ayodhya Nagar, Bhopal",
    googleMaps: "https://maps.app.goo.gl/XnW6DUaLRCxb1ymbA",
    instagram: "https://www.instagram.com/ss_admission_wala",
    facebook: "https://www.facebook.com/profile.php?id=61587254466624",
    youtube: "https://www.youtube.com/@SSADMISSIONVALA",
  };

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Don't show on contact or counselor dashboard
      if (location.pathname === "/contact" || location.pathname === "/counselors/dashboard") {
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling DOWN - hide popup
        setShowPopup(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP - show popup
        setShowPopup(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, location.pathname]);

  const openWhatsApp = () => {
    const message = `Hello SS Admission Wala, I'm interested in career counseling.`;
    window.open(
      `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/course-pages-dashboard" element={<CoursePagesDashboard />} />
          <Route path="/city-target-dashboard" element={<CityTargetDashboard />} />

          <Route
            path="/Counselors/Dashboard"
            element={
              <ProtectedCounselorRoute>
                <CounselorDashboard />
              </ProtectedCounselorRoute>
            }
          />
        </Routes>
      </main>

      {!hideFooter && <Footer />}

      {/* Contact Popup - Smooth Transition */}
      {location.pathname !== "/contact" && location.pathname !== "/counselors/dashboard" && (
        <div
          onClick={() => navigate("/contact")}
          className={`
            fixed top-28 right-6 z-[999] 
            bg-gradient-to-r from-indigo-600 to-white 
            text-black px-6 py-3 rounded-2xl 
            shadow-2xl cursor-pointer 
            hover:scale-105 transition-all
            font-semibold
            transform transition-all duration-500 ease-in-out
            ${showPopup 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 translate-x-10 pointer-events-none"
            }
          `}
        >
          📞 Need Counseling? Click Here
        </div>
      )}

      {/* Floating Social Icons - Always visible */}
      {!hideSocialIcons && (
        <div className="fixed bottom-22 right-6 z-50 flex flex-col gap-3 items-center">
          <button
            onClick={openWhatsApp}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-green-400 flex items-center justify-center hover:shadow-green-500/50 transition-all hover:scale-110"
          >
            <img
              src="/whatsapp.webp"
              alt="WhatsApp"
              className="w-full h-full object-cover rounded-full"
            />
          </button>

          {/* Instagram */}
          <a
            href={contactInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-400 via-red-300 to-yellow-300 
              flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <FaInstagram className="w-5 h-5 text-white" />
          </a>

          {/* Facebook */}
          <a
            href={contactInfo.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-blue-400 
              flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <FaFacebook className="w-5 h-5 text-white" />
          </a>

          {/* YouTube */}
          <a
            href={contactInfo.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-red-400 
              flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <FaYoutube className="w-5 h-5 text-white" />
          </a>
        </div>
      )}
    </div>
  );
}

export default AppRoutes;
import { Routes, Route, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import { AnimatePresence, motion } from "framer-motion";
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

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const hideFooter = location.pathname === "/contact";
  const hideSocialIcons = location.pathname === "/contact" || location.pathname === "/counselors/dashboard";


  useEffect(() => {
    setShowPopup(true);

    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      // Don't show on contact or counselor dashboard
      if (
        location.pathname === "/contact" ||
        location.pathname === "/Counselors/Dashboard"
      ) {
        return;
      }

      setShowPopup(true);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setShowPopup(false);
      }, 5000); // 5 sec after scroll stops
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [location.pathname]);


  const openWhatsApp = () => {
    const message = `Hello SS Admission Wala, I'm interested in career counseling.`;
    window.open(
      `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };


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



      {/* Contact Popup */}
      {showPopup &&
        location.pathname !== "/contact" &&
        location.pathname !== "/counselors/dashboard" && <AnimatePresence>
          {showPopup && location.pathname !== "/contact" && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.6 }}
              onClick={() => navigate("/contact")}
              className="fixed top-28 right-6 z-[999] 
                 bg-gradient-to-r from-indigo-600 to-white 
                 text-black px-6 py-3 rounded-2xl 
                 shadow-2xl cursor-pointer 
                 hover:scale-105 transition-all
                 font-semibold"

            >
              📞 Need Counseling? Click Here
            </motion.div>
          )}
        </AnimatePresence>}


      {/* Floating Social Icons */}
      {hideSocialIcons ? null : <div className="fixed bottom-22 right-6 z-50 flex flex-col gap-3 items-center">

        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.2 }}
          onClick={openWhatsApp}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-green-400 flex items-center justify-center hover:shadow-green-500/50 transition-all"
        >
          {/* <MessageSquare className="w-5 h-5 text-white" /> */}
          <img
            src="/whatsapp.webp"
            alt="WhatsApp"
            className="w-full h-full object-cover rounded-full"
          />
        </motion.button>

        {/* Instagram */}
        <motion.a
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.2 }}
          href={contactInfo.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-400 via-red-300 to-yellow-300 
               flex items-center justify-center shadow-lg transition-all"
        >
          <FaInstagram className="w-5 h-5 text-white" />
        </motion.a>

        {/* Facebook */}
        <motion.a
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.2 }}
          href={contactInfo.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-blue-400 
               flex items-center justify-center shadow-lg transition-all"
        >
          <FaFacebook className="w-5 h-5 text-white" />
        </motion.a>

        {/* YouTube */}
        <motion.a
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.2 }}
          href={contactInfo.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-red-400 
               flex items-center justify-center shadow-lg transition-all"
        >
          <FaYoutube className="w-5 h-5 text-white" />
        </motion.a>

      </div>}
    </div>
  );
}

export default AppRoutes;

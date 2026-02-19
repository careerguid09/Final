import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./AppRoutes";
import { trackPageVisit } from "./Redux-toolkit/features/visitorThunks"; // 👈 IMPORT

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
 
    const trackVisit = async () => {
      try {
        await dispatch(trackPageVisit()).unwrap();
        console.log(' Visitor tracked');
      } catch (error) {
    
        console.log('Visitor tracking failed (not critical)');
      }
    };

    trackVisit();
  }, [dispatch]);

  return (
    <div className="pt-16">
      <Router>
        <ScrollToTop />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme="colored"
        />
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
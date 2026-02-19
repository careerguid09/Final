import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "../../components/ScrollToTop.jsx";
import { toast } from "react-toastify";

import {
  Stethoscope,
  Pill,
  UserRound,
  Microscope,
  Settings,
  Briefcase,
  GraduationCap,
  BookOpen,
  Laptop,
  Languages,
  Leaf,
  Presentation,
  Clock,
  ChevronRight,
  MapPin,
  CheckCircle,
  ChevronLeft,
  Mail,
  Phone,
  MessageSquare,
  RefreshCcw,
  Trash2,
  Users,
  ArrowRight,
  Home,
  TrendingUp,
  FileSpreadsheet,
  Database,
  Sparkles,
  Globe,
  Calendar,
  Eye,
  UserPlus,
  BarChart3,
  RefreshCw,
} from "lucide-react";

import {
  getDomainStats,
  getStudentsByCourse,
  markStudentViewed,
  markCourseViewed,
  deleteStudent,
  updateStudentStatus,
  getAllStudents,
} from "../../Redux-toolkit/features/studentsThunks.js";
import Tooltip from "../../utils/Tooltip.jsx";

import {
  trackPageVisit,
  getVisitorStats,
  getTodayVisitors,
} from "../../Redux-toolkit/features/visitorThunks.js";

const useAfterRender = (callback, dependencies) => {
  useEffect(() => {
    if (dependencies.every(dep => dep !== undefined && dep !== null)) {
      requestAnimationFrame(() => {
        queueMicrotask(() => {
          callback();
        });
      });
    }
  }, dependencies);
};

const domainData = {
  MEDICAL: ["MBBS", "BAMS", "BHMS", "BNYS"],
  PHARMACY: ["B.Pharma", "D.Pharma", "M.Pharma", "Pharm D", "PhD Pharmacy"],
  NURSING: ["ANM", "GNM", "BSc Nursing", "MSc Nursing", "Post Basic Nursing"],
  PARAMEDICAL: [
    "X-Ray Technician (Radiology)",
    "BMLT",
    "DMLT",
    "BPT",
    "MPT",
    "Bachelor of Human Nutrition",
  ],
  ENGINEERING: [
    "Diploma Engineering",
    "B.Tech",
    "BE",
    "M.Tech",
    "ME",
    "PhD Engineering",
  ],
  MANAGEMENT: ["BBA", "MBA", "PGDM"],
  GRADUATION: ["BA", "BSc", "BCom"],
  POST_GRADUATION: ["MA", "MSc", "MCom"],
  LANGUAGE_COURSES: ["German", "French", "Italian", "Chinese"],
  AGRICULTURE: ["BSc Agriculture", "MSc Agriculture"],
  EDUCATION_COURSES : ["B.Ed", "D.El.Ed", "CTET Guidance", "STET Guidance"],
  VOCATIONAL_COURSES : ["BCA", "MCA", "PGDCA", "B.Lib", "M.Lib"]
};

const CounselorDashboard = () => {
  const dispatch = useDispatch();


  const studentState = useSelector((state) => state.students);
  const visitorState = useSelector(
    (state) =>
      state.visitors || { totalAllTime: 0, todayUnique: 0, weeklyData: [] },
  );

  const { loading, stats, allStudents } = studentState;
  const [filterDomain, setFilterDomain] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentView, setCurrentView] = useState("dashboard");
  const [displayStudents, setDisplayStudents] = useState([]);
  const [viewTitle, setViewTitle] = useState("");

  const domainStats = stats?.domain || [];
  const courseStats = stats?.course || [];
  const overallStats = stats?.overall || {
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
  };


  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

 
  const counselorDomains = [
    {
      id: 1,
      name: "MEDICAL",
      icon: Stethoscope,
      bgColor: "bg-red-50",
      color: "text-red-600",
      description: "Healthcare and surgical medical programs",
    },
    {
      id: 2,
      name: "PHARMACY",
      icon: Pill,
      bgColor: "bg-emerald-50",
      color: "text-emerald-600",
      description: "Pharmaceutical sciences and drug research",
    },
    {
      id: 3,
      name: "NURSING",
      icon: UserRound,
      bgColor: "bg-blue-50",
      color: "text-blue-600",
      description: "Clinical nursing and healthcare assistance",
    },
    {
      id: 4,
      name: "PARAMEDICAL",
      icon: Microscope,
      bgColor: "bg-purple-50",
      color: "text-purple-600",
      description: "Paramedical and allied health services",
    },
    {
      id: 5,
      name: "ENGINEERING",
      icon: Settings,
      bgColor: "bg-orange-50",
      color: "text-orange-600",
      description: "Technical and technological innovations",
    },
    {
      id: 6,
      name: "MANAGEMENT",
      icon: Briefcase,
      bgColor: "bg-indigo-50",
      color: "text-indigo-600",
      description: "Business leadership and administration",
    },
    {
      id: 7,
      name: "GRADUATION",
      icon: BookOpen,
      bgColor: "bg-teal-50",
      color: "text-teal-600",
      description: "Undergraduate arts and science degrees",
    },
    {
      id: 8,
      name: "POST GRADUATION",
      icon: GraduationCap,
      bgColor: "bg-cyan-50",
      color: "text-cyan-600",
      description: "Advanced master and research programs",
    },
    {
      id: 9,
      name: "VOCATIONAL",
      icon: Laptop,
      bgColor: "bg-pink-50",
      color: "text-pink-600",
      description: "Skill-based technical training",
    },
    {
      id: 10,
      name: "LANGUAGES",
      icon: Languages,
      bgColor: "bg-yellow-50",
      color: "text-yellow-600",
      description: "Global communication and linguistics",
    },
    {
      id: 11,
      name: "AGRICULTURE",
      icon: Leaf,
      bgColor: "bg-lime-50",
      color: "text-lime-600",
      description: "Farm science and agricultural technology",
    },
    {
      id: 12,
      name: "EDUCATION",
      icon: Presentation,
      bgColor: "bg-amber-50",
      color: "text-amber-600",
      description: "Teacher training and pedagogical studies",
    },
  ];


  const refreshAllData = useCallback(async () => {
    try {
      await dispatch(getAllStudents()).unwrap();
      await dispatch(getDomainStats()).unwrap();
      await dispatch(getVisitorStats()).unwrap();
      await dispatch(getTodayVisitors()).unwrap();
    } catch (error) {
      console.error("Refresh error:", error);
    }
  }, [dispatch]);

useEffect(() => {
  const fetchAllData = async () => {
    try {
      await dispatch(getAllStudents()).unwrap();
      await dispatch(getDomainStats()).unwrap();

      await dispatch(getVisitorStats()).unwrap();
      await dispatch(getTodayVisitors()).unwrap();
      console.log("✅ All data fetched successfully");
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  fetchAllData();

  const interval = setInterval(
    () => {
      dispatch(getVisitorStats());
      dispatch(getTodayVisitors());
    },
    5 * 60 * 1000,
  );

  return () => clearInterval(interval);
}, [dispatch]);


  const isStudentNew = (student) => {
    if (!student) return false;

    if (student.studentViewed === true) return false;

    if (student.isNew === false) return false;

   
    if (student.newAt) {
      const newAt = new Date(student.newAt);
      const now = new Date();
      const daysDiff = (now - newAt) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }

    return false;
  };

  
  const handleDomainClick = (domainName) => {
    setSelectedDomain({ name: domainName });
    setSelectedCourse(null);

 
    const domainStudents =
      allStudents?.filter((s) => s.domain === domainName) || [];
    setDisplayStudents(domainStudents);
    setViewTitle(`${domainName} Students`);
    setCurrentView("clients");
  };


  const handleStatusClick = (type) => {
    let data = [];
    if (type === "new") {
      data = allStudents?.filter((s) => isStudentNew(s)) || [];
    }
    if (type === "in-progress") {
      data = allStudents?.filter((s) => s.status === "in-progress") || [];
    }
    if (type === "completed") {
      data = allStudents?.filter((s) => s.status === "completed") || [];
    }

    setDisplayStudents(data);
    setViewTitle(`${type.toUpperCase()} Students`);
    setCurrentView("clients");
  };

  const handleCourseClick = async (course) => {
    try {
      if (course.hasNew) {
        await dispatch(markCourseViewed(course.course)).unwrap();
        await refreshAllData();
      }
      setSelectedCourse(course);

      const courseStudents =
        allStudents?.filter((s) => s.course === course.course) || [];
      setDisplayStudents(courseStudents);
      setCurrentView("clients");
    } catch (error) {
      console.error("Course click error:", error);
    }
  };

 const handleClientClick = async (client) => {
  try {
    if (isStudentNew(client)) {
      const loadingToast = toast.loading("Marking as viewed...");  // 👈 ADD THIS

      await dispatch(markStudentViewed(client._id)).unwrap();

      toast.dismiss(loadingToast);
      await refreshAllData();

      const updatedClient =
        allStudents?.find((s) => s._id === client._id) || client;
      setSelectedClient(updatedClient);
      setCurrentView("clientDetail");

      // ✅ RENDER KE BAAD TOAST
      useAfterRender(() => {
        toast.success("Student marked as viewed");
      }, [currentView, selectedClient?._id]);
      
    } else {
      setSelectedClient(client);
      setCurrentView("clientDetail");
    }
  } catch (error) {
    console.error("Client click error:", error);
    useAfterRender(() => {
      toast.error(error || "Failed to mark student as viewed");
    }, [currentView, selectedClient?._id]);
    
    setSelectedClient(client);
    setCurrentView("clientDetail");
  }
};

  const deleteClientHandler = async (clientId) => {
    try {
      const loadingToast = toast.loading("Deleting student...");

      const result = await dispatch(deleteStudent(clientId)).unwrap();

      toast.dismiss(loadingToast);

      if (result.success) {
        setDeleteModal(null);

        await refreshAllData();

        if (selectedClient && selectedClient._id === clientId) {
          setSelectedClient(null);
          setCurrentView("clients");
        }

        setDisplayStudents((prev) => prev.filter((s) => s._id !== clientId));

        toast.success("Student deleted successfully");
      }
    } catch (err) {
      toast.error(err || "Failed to delete student");
    }
  };

const updateClientStatusHandler = async (clientId, status) => {
  try {
    
    setSelectedClient(prev => ({
      ...prev,
      status: status
    }));

    setDisplayStudents(prev => 
      prev.map(s => s._id === clientId ? { ...s, status } : s)
    );

    // ✅ STEP 2: TURANT TOAST - 0 DELAY!
    toast.success("Status updated successfully!");  // 👈 TURANT TOAST!

    // ✅ STEP 3: Background mein API call
    const result = await dispatch(
      updateStudentStatus({ id: clientId, status }),
    ).unwrap();

    // Background refresh
    refreshAllData();
    
  } catch (err) {
    console.error("Status update failed:", err);
    
 
    toast.error("Failed to update status");
    
    await refreshAllData();
  }
};

  const exportToExcel = async () => {
    try {
      setExporting(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/clients/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("counselorToken")}`,
          },
        },
      );

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Students_Data_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Export successful!");
    } catch (err) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
    toast.info("Dashboard refreshed!");
  };

  // Handle page refresh
  const handlePageRefresh = () => {
    window.location.reload();
  };

  const handleBackToDashboard = () => {
    setSelectedDomain(null);
    setSelectedCourse(null);
    setSelectedClient(null);
    setFilterDomain("");
    setFilterCourse("");
    setSearchTerm("");
    setCurrentView("dashboard");
    window.scrollTo(0, 0);
  };

  const handleBackToClients = () => {
    setCurrentView("clients");
    window.scrollTo(0, 0);
  };

  // FIXED: Filter students logic
  const filteredStudents = (displayStudents || []).filter((s) => {
    if (!s) return false;

    // Domain filter
    if (selectedDomain) {
      if (s.domain !== selectedDomain.name) return false;
      if (filterCourse && s.course !== filterCourse) return false;
    } else {
      if (filterDomain && s.domain !== filterDomain) return false;
      if (filterCourse && s.course !== filterCourse) return false;
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nameMatch = s.fullName?.toLowerCase().includes(term);
      const cityMatch = s.city?.toLowerCase().includes(term);
      const emailMatch = s.email?.toLowerCase().includes(term);
      const phoneMatch = s.phone?.toLowerCase().includes(term);
      return nameMatch || cityMatch || emailMatch || phoneMatch;
    }

    return true;
  });

  // FIXED: Get new students count
  const getNewStudentsCount = () => {
    return allStudents?.filter((s) => isStudentNew(s)).length || 0;
  };

  // Dashboard Render
  const renderDashboard = () => {
    const isDashboardEmpty = !allStudents || allStudents.length === 0;
    const newCount = getNewStudentsCount();

    return (
      <div>
        <ScrollToTop />

        {/* Visitor Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Unique Visitors */}
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-purple-700">
                  {visitorState.totalAllTime || 0}
                </div>
                <div className="text-xs text-purple-600">Total Unique</div>
              </div>
            </div>
            <div className="text-sm text-purple-700 font-medium">
              All Time Unique Visitors
            </div>
          </div>

          {/* Today Unique Visitors */}
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <UserPlus size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-blue-700">
                  {visitorState.todayUnique || 0}
                </div>
                <div className="text-xs text-blue-600">Today</div>
              </div>
            </div>
            <div className="text-sm text-blue-700 font-medium">
              Unique Visitors Today
            </div>
          </div>

          {/* Weekly Average */}
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <BarChart3 size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-700">
                  {visitorState.weeklyData?.length > 0
                    ? Math.round(
                        visitorState.weeklyData.reduce(
                          (acc, day) => acc + day.unique,
                          0,
                        ) / visitorState.weeklyData.length,
                      )
                    : 0}
                </div>
                <div className="text-xs text-emerald-600">Avg. Daily</div>
              </div>
            </div>
            <div className="text-sm text-emerald-700 font-medium">
              Weekly Average
            </div>
          </div>

          {/* Refresh Button */}
          <div
            onClick={handleManualRefresh}
            className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center transition-all duration-500 ${refreshing ? "animate-spin" : "group-hover:rotate-180"}`}
              >
                <RefreshCw size={24} />
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-700">
                  Click to
                </div>
                <div className="text-xs text-slate-600">Refresh</div>
              </div>
            </div>
            <div className="text-sm text-slate-700 font-medium">
              Refresh Data
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 mb-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/20 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-800/20 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl font-black mb-4">
                Welcome back, Counselor! 👋
              </h1>
              <p className="text-blue-200 text-lg">
                Manage {allStudents?.length || 0} students across{" "}
                {domainStats.length || 0} domains.
                {newCount > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 bg-gradient-to-r from-pink-600 to-red-500 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                    <Sparkles size={14} /> {newCount} NEW
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <Tooltip text="Refresh Data" placement="top"></Tooltip>
                <Tooltip text="Hard Refresh" placement="top"></Tooltip>
                <Tooltip
                  text={
                    isDashboardEmpty
                      ? "No data to export"
                      : "Export all students data"
                  }
                  placement="top"
                >
                  <button
                    onClick={exportToExcel}
                    disabled={exporting || isDashboardEmpty}
                    className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                      isDashboardEmpty
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    <FileSpreadsheet size={18} />
                    {exporting ? "Exporting..." : "Get All Students Data"}
                  </button>
                </Tooltip>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Database size={28} />
                </div>
                <div>
                  <div className="text-2xl font-black">
                    {allStudents?.length || 0}
                  </div>
                  <div className="text-sm text-blue-200">Total Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isDashboardEmpty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6 rotate-3">
              <Users size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-3">
              No Students Yet
            </h2>
            <p className="text-slate-500 max-w-md text-lg">
              No students are currently registered. Once students enroll, they
              will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats Cards - FIXED: New students count properly updates */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {[
                {
                  label: "New Students",
                  val: newCount,
                  color: "text-blue-700",
                  icon: Clock,
                  bg: "from-blue-50",
                  type: "new",
                  sub: "Require attention",
                },
                {
                  label: "In Progress",
                  val: overallStats.inProgress || 0,
                  color: "text-amber-700",
                  icon: RefreshCcw,
                  bg: "from-amber-50",
                  type: "in-progress",
                  sub: "Active counseling",
                },
                {
                  label: "Completed",
                  val: overallStats.completed || 0,
                  color: "text-emerald-700",
                  icon: CheckCircle,
                  bg: "from-emerald-50",
                  type: "completed",
                  sub: "Finished counseling",
                },
                {
                  label: "Total Students",
                  val: allStudents?.length || 0,
                  color: "text-slate-700",
                  icon: TrendingUp,
                  bg: "from-slate-50",
                  type: "total",
                  sub: "Across all domains",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={
                    item.type !== "total"
                      ? () => handleStatusClick(item.type)
                      : undefined
                  }
                  className={`bg-gradient-to-br ${item.bg} to-white border border-slate-100 rounded-2xl p-6 transition-all group relative
                    ${item.type === "total" ? "cursor-default" : "cursor-pointer hover:shadow-xl"}
                  `}
                >
                  {item.type === "new" && item.val > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                      <Sparkles size={10} /> NEW
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-3xl font-black ${item.color} mb-1`}>
                        {item.val}
                      </div>
                      <div className={`${item.color} font-semibold`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {item.sub}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                      <item.icon size={24} className={item.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Domains Section - FIXED: Domain new tags update properly */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">
                    Specialization Domains
                  </h2>
                  <p className="text-slate-500">
                    Select a domain to explore courses and students
                  </p>
                </div>
                <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-xl">
                  {domainStats.length} domains available
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {domainStats.map((domain) => {
                  const info =
                    counselorDomains.find((d) => d.name === domain.domain) ||
                    counselorDomains[0];
                  const hasNewStudents =
                    allStudents?.some(
                      (s) => s.domain === domain.domain && isStudentNew(s),
                    ) || false;

                  return (
                    <div
                      key={domain.domain}
                      onClick={() => handleDomainClick(domain.domain)}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 cursor-pointer relative transition-all duration-300 group"
                    >
                      {hasNewStudents && (
                        <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <Sparkles size={10} />
                          NEW
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className={`w-14 h-14 rounded-xl ${info.bgColor} ${info.color} flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm`}
                        >
                          <info.icon size={24} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-slate-800">
                            {domain.total}
                          </div>
                          <div className="text-xs text-slate-500">Students</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {domain.domain}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 h-10 overflow-hidden">
                        {info.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold group-hover:text-blue-700">
                          View Details{" "}
                          <ChevronRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                        {hasNewStudents && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Domain Courses Render
  const renderDomainCourses = () => {
    const hasCourses = courseStats && courseStats.length > 0;
    const domainCourses = courseStats.filter((c) =>
      allStudents?.some(
        (s) => s.course === c.course && s.domain === selectedDomain?.name,
      ),
    );

    return (
      <div>
        <ScrollToTop />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToDashboard}
              className="p-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">
                {selectedDomain?.name} Courses
              </h2>
              <p className="text-slate-500">
                {domainCourses.length > 0
                  ? "Select a course to view enrolled students"
                  : "No courses found in this domain"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl">
            <Home size={16} />
            <span
              onClick={handleBackToDashboard}
              className="cursor-pointer hover:text-blue-600"
            >
              Dashboard
            </span>
            <ChevronRight size={16} />
            <span className="font-semibold text-blue-600">
              {selectedDomain?.name}
            </span>
          </div>
        </div>

        {domainCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainCourses.map((course, index) => {
              const hasNewStudents =
                allStudents?.some(
                  (s) => s.course === course.course && isStudentNew(s),
                ) || false;

              return (
                <div
                  key={index}
                  onClick={() => handleCourseClick(course)}
                  className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:border-blue-400 cursor-pointer group relative transition-all duration-300"
                >
                  {hasNewStudents && (
                    <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse flex items-center gap-1">
                      <Sparkles size={10} />
                      NEW
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700">
                        {course.course}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {selectedDomain?.name} Domain
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="text-sm text-slate-600">
                      {course.total} students{" "}
                      {hasNewStudents && (
                        <span className="ml-1 text-red-500 font-semibold">
                          • New
                        </span>
                      )}
                    </div>
                    <div className="text-blue-600 font-semibold flex items-center gap-1 group-hover:text-blue-700">
                      View Students{" "}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6">
              <BookOpen size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No Courses Found
            </h3>
            <p className="text-slate-500 max-w-sm mb-8">
              No courses available for the{" "}
              <span className="font-semibold text-slate-700">
                "{selectedDomain?.name}"
              </span>{" "}
              domain.
            </p>
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <ChevronLeft size={18} />
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  };

  // Clients List Render
  const renderClients = () => (
    <div>
      <ScrollToTop />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="p-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              {viewTitle || "Students"}
            </h2>
            <p className="text-slate-500">
              {filteredStudents.length} students found
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl">
          <Home size={16} />
          <span
            onClick={handleBackToDashboard}
            className="cursor-pointer hover:text-blue-600"
          >
            Dashboard
          </span>
          <ChevronRight size={16} />
          <span className="font-semibold text-blue-600 truncate max-w-[150px]">
            {viewTitle || "Students"}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4 mb-8 bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
        {/* Search Box */}
        <div className="flex-1 max-w-full md:max-w-sm">
          <label className="text-xs font-bold text-slate-500 mb-2 ml-1 flex items-center gap-1 uppercase tracking-wider">
            <Users size={14} /> Search Student
          </label>
          <div className="relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, city, email or phone..."
              className="w-full pl-4 pr-10 py-3 text-sm rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50 group-hover:bg-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Database size={18} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {!selectedDomain && (
            <>
              <div className="w-full sm:w-44">
                <label className="text-xs font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider">
                  Domain
                </label>
                <div className="relative">
                  <select
                    value={filterDomain}
                    onChange={(e) => {
                      setFilterDomain(e.target.value);
                      setFilterCourse("");
                    }}
                    className="w-full appearance-none px-4 py-3 text-sm rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
                  >
                    <option value="">All Domains</option>
                    {Object.keys(domainData).map((domain) => (
                      <option key={domain} value={domain}>
                        {domain.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="w-full sm:w-44">
                <label className="text-xs font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider">
                  Course
                </label>
                <div className="relative">
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="w-full appearance-none px-4 py-3 text-sm rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
                  >
                    <option value="">All Courses</option>
                    {filterDomain &&
                      domainData[filterDomain]?.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                  </select>
                  <ChevronRight
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </>
          )}

          {selectedDomain && (
            <div className="w-full sm:w-64">
              <label className="text-xs font-bold text-blue-600 mb-2 ml-1 flex items-center gap-1 uppercase tracking-wider">
                <Sparkles size={14} /> {selectedDomain.name}
              </label>
              <div className="relative">
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full appearance-none px-4 py-3 text-sm rounded-2xl border-2 border-blue-100 bg-blue-50/30 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-blue-900 cursor-pointer"
                >
                  <option value="">All Courses</option>
                  {domainData[
                    selectedDomain.name.toUpperCase().replace(/\s+/g, "_")
                  ]?.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <BookOpen
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
                />
              </div>
            </div>
          )}

          {(filterCourse || filterDomain || searchTerm) && (
            <button
              onClick={() => {
                setFilterCourse("");
                setFilterDomain("");
                setSearchTerm("");
              }}
              className="mt-6 sm:mt-0 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Clear Filters"
            >
              <RefreshCcw size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
            <Users size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">
            No Students Found
          </h2>
          <p className="text-slate-500 max-w-md text-lg mb-8">
            No students match your current filters.
          </p>
          <button
            onClick={() => {
              setFilterCourse("");
              setFilterDomain("");
              setSearchTerm("");
            }}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((client) => {
            const isNew = isStudentNew(client);

            return (
              <div
                key={client._id}
                onClick={() => handleClientClick(client)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 cursor-pointer transition-all duration-300 group relative"
              >
                {isNew && (
                  <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <Sparkles size={10} /> NEW
                  </div>
                )}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl transition-colors ${
                        isNew
                          ? "bg-red-100 text-red-600"
                          : "bg-slate-100 text-slate-700 group-hover:bg-blue-50"
                      }`}
                    >
                      {client.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-700">
                        {client.fullName}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin size={12} />
                        {client.city || "Location not set"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal(client);
                    }}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Tooltip text="Delete Student" placement="top">
                      <Trash2 size={18} />
                    </Tooltip>
                  </button>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <Mail size={14} />
                    </div>
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                      <Phone size={14} />
                    </div>
                    <span>{client.phone}</span>
                  </div>
                </div>
                <div className="pt-5 border-t flex items-center justify-between">
                  <span
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      client.status === "new"
                        ? "bg-blue-100 text-blue-600"
                        : client.status === "in-progress"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {client.status}
                  </span>
                  <div className="text-blue-600 font-semibold text-sm flex items-center gap-1">
                    View Details{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Client Detail Render
  const renderClientDetail = () => {
    if (!selectedClient) return null;
    const isNew = isStudentNew(selectedClient);

    return (
      <div>
        <ScrollToTop />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToClients}
              className="p-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">
                Student Details
              </h2>
              <p className="text-slate-500">
                Complete information about {selectedClient.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl">
            <Home size={16} />
            <span
              className="hover:text-blue-600 cursor-pointer"
              onClick={handleBackToDashboard}
            >
              Dashboard
            </span>
            <ChevronRight size={16} />
            <span className="font-semibold text-blue-600 truncate max-w-[150px]">
              {selectedClient.fullName}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-8 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div
                    className={`w-24 h-24 border-4 border-white shadow-lg rounded-2xl flex items-center justify-center font-black text-3xl ${
                      isNew
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedClient.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  {isNew && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse flex items-center gap-2">
                        <Sparkles size={12} /> NEW
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">
                    {selectedClient.fullName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500" />
                      <span>
                        {selectedClient?.city || "N/A"},{" "}
                        {selectedClient?.state || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-purple-500" />
                      <span className="font-semibold">
                        {selectedClient.course || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Tooltip text="Delete Student permanently" placement="top">
                <button
                  onClick={() => setDeleteModal(selectedClient)}
                  className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-800 border-b pb-3">
                  Personal Information
                </h4>
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Email Address
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Mail size={18} />
                      </div>
                      <div className="font-medium break-all">
                        {selectedClient.email}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Phone Number
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                        <Phone size={18} />
                      </div>
                      <div className="font-medium">{selectedClient.phone}</div>
                    </div>
                  </div>
                  {selectedClient.age > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Age
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                          <Calendar size={18} />
                        </div>
                        <div className="font-medium">{selectedClient.age}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-800 border-b pb-3">
                  Academic Information
                </h4>
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Education Level
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                        <GraduationCap size={18} />
                      </div>
                      <div className="font-medium">
                        {selectedClient.eduLevel || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Selected Domain
                    </div>
                    <div className="font-medium text-blue-600 text-lg">
                      {selectedClient.domain || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Selected Course
                    </div>
                    <div className="font-medium text-blue-600 text-lg">
                      {selectedClient.course || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-800 border-b pb-3">
                  Status & Actions
                </h4>
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Current Status
                    </div>
                    <div className="flex gap-3">
                      {["new", "in-progress", "completed"].map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            updateClientStatusHandler(selectedClient._id, s)
                          }
                          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                            selectedClient.status === s
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {s === "in-progress" ? "In Progress" : s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Joined Date & Time
                    </div>
                    <div className="font-medium">
                      {formatDate(selectedClient.createdAt)}
                      {selectedClient.createdAt && (
                        <span className="text-slate-400 ml-1">
                          at {formatDateTime(selectedClient.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedClient.country && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Country
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 text-blue-600 rounded-lg flex items-center justify-center">
                          <Globe size={18} />
                        </div>
                        <div className="font-medium">
                          {selectedClient.country}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedClient.message && (
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare size={20} className="text-slate-400" />
                  <h4 className="text-lg font-bold text-slate-700">
                    Student's Message
                  </h4>
                </div>
                <div className="text-slate-600 leading-relaxed bg-white p-5 rounded-xl border border-slate-200 italic">
                  "{selectedClient.message}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Utils
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 pb-20">
      <ScrollToTop />
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {loading && !refreshing && allStudents?.length === 0 ? (
          // Loading skeleton
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-40 bg-slate-200 rounded"></div>
              </div>
              <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4"
                >
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-8 w-16 bg-slate-300 rounded-lg"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-300 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                      <div className="h-3 w-24 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-slate-200 rounded"></div>
                    <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {currentView === "dashboard" && renderDashboard()}
            {currentView === "domainCourses" && renderDomainCourses()}
            {currentView === "clients" && renderClients()}
            {currentView === "clientDetail" && renderClientDetail()}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm gap-4">
          <div>© 2026 CounselorPro. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Eye size={14} />
              <span>Total Visitors: {visitorState.totalAllTime || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserPlus size={14} />
              <span>Today: {visitorState.todayUnique || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={14} />
              <span>Students: {allStudents?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl transition-all border border-slate-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">
              Delete Student Record
            </h3>
            <p className="text-slate-600 mb-8">
              Are you sure you want to delete <b>{deleteModal.fullName}</b>?
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteClientHandler(deleteModal._id)}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;
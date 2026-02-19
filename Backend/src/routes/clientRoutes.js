const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route (no auth)
router.post("/", clientController.createClient);

// Apply auth middleware to all routes below
router.use(authMiddleware); 

// ✅ Main routes
router.get("/", clientController.getAllClients);
router.get("/stats", clientController.getDomainStats);
router.get("/filter", clientController.getClientsByDynamicFilter);
router.get("/dashboard-stats", clientController.getDashboardStats);
router.get("/recent-new", clientController.getRecentNewStudents);
router.get("/unviewed-counts", clientController.getUnviewedCounts);
router.get("/export", clientController.exportClientsToExcel);

// Stats routes
router.get("/stats/domain", clientController.getDomainStats);
router.get("/stats/course/:domain", clientController.getCourseStats);

// Filter routes
router.get("/domain/:domain", clientController.getClientsByDomain);
router.get("/course/:course", clientController.getClientsByCourse);
router.get("/category/:category", clientController.getClientsByCategory);

// Update routes
router.patch("/:id/status", clientController.updateClientStatus);
router.delete("/:id", clientController.deleteClient);

// View routes
router.patch("/domain/viewed/:domain", clientController.markDomainAsViewed);
router.patch("/course/viewed/:course", clientController.markCourseAsViewed);
router.patch("/student/viewed/:clientId", clientController.markStudentAsViewed);
router.patch("/bulk-viewed", clientController.bulkMarkAsViewed);

// Cleanup
router.post("/auto-cleanup", clientController.autoMarkOldAsViewed);

module.exports = router;
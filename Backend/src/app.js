const express = require("express");
const cors = require("cors");
const clientRoutes = require("./routes/clientRoutes");
const counselorRoutes = require("./routes/counselorRoutes");
const visitorRoutes = require('./routes/visitorRoutes');
const authMiddleware = require("./middleware/authMiddleware");
const path = require('path');
const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL_FIRST, process.env.FRONTEND_URL_SECOND, process.env.FRONTEND_URL],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


app.use("/visitors", visitorRoutes);       


app.use("/clients", clientRoutes);          
app.use("/counselor", counselorRoutes);    

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`✅ Public routes:`);
  console.log(`   - GET/POST /visitors/*`);
  console.log(`   - POST /counselor/register`);
  console.log(`   - POST /counselor/login`);
  console.log(`✅ Protected routes (require token):`);
  console.log(`   - /clients/*`);
  console.log(`   - POST /counselor/logout`);
});

module.exports = app;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Counselor = require("./src/models/Counselor");
const dotenv = require("dotenv");
dotenv.config();

async function seedCounselor() {
  try {
    console.log("🔵 Step 1: Connecting to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGO_URI ? "✅ Found" : "❌ Missing");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Step 2: MongoDB connected successfully");

    console.log("🔵 Step 3: Checking for existing counselor...");
    const existing = await Counselor.findOne({
      email: "counselor@company.com",
    });
    
    if (existing) {
      console.log("✅ Step 4: Counselor found with ID:", existing._id);
      console.log("🔵 Step 5: Deleting existing counselor...");
      
      const deleteResult = await Counselor.deleteOne({ email: "counselor@company.com" });
      console.log("✅ Step 6: Delete result:", deleteResult);
      
      if (deleteResult.deletedCount === 0) {
        console.log("⚠️ Warning: No counselor was deleted!");
      } else {
        console.log("✅ Counselor deleted successfully");
      }
    } else {
      console.log("✅ Step 4: No existing counselor found");
    }

    console.log("🔵 Step 7: Hashing password...");
    const hashedPassword = await bcrypt.hash("Counselor@123#Secure", 10);
    console.log("✅ Step 8: Password hashed successfully");

    console.log("🔵 Step 9: Creating new counselor...");
    console.log("Email: counselor@company.com");
    console.log("Password hash length:", hashedPassword.length);

    const counselor = await Counselor.create({
      email: "counselor@company.com",
      password: hashedPassword,
    });

    console.log("✅ Step 10: Counselor created successfully!");
    console.log("📝 Counselor details:");
    console.log("  - ID:", counselor._id);
    console.log("  - Email:", counselor.email);
    console.log("  - Created at:", counselor.createdAt || "N/A");

    console.log("🔵 Step 11: Closing database connection...");
    await mongoose.connection.close();
    console.log("✅ Step 12: Connection closed");
    console.log("🎉 Seed completed successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌❌❌ ERROR DETECTED ❌❌❌");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    if (error.code) {
      console.error("Error code:", error.code);
    }
    
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
    
    console.log("\n🔴 Step where error occurred - check above");
    
    try {
      await mongoose.connection.close();
      console.log("Database connection closed");
    } catch (e) {
    
    }
    
    process.exit(1);
  }
}


console.log("🔍 Pre-run checks:");
console.log("1. Checking environment variables...");
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file!");
  process.exit(1);
}
console.log("✅ MONGO_URI found");

console.log("2. Checking MongoDB connection string format...");
if (!process.env.MONGO_URI.startsWith('mongodb://') && !process.env.MONGO_URI.startsWith('mongodb+srv://')) {
  console.error("❌ Invalid MongoDB URI format!");
  process.exit(1);
}
console.log("✅ MongoDB URI format looks correct");

console.log("3. Starting seed process...\n");
seedCounselor();
const Visitor = require('../models/Visitor');

// Helper function to detect device type
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || 
      ua.includes('blackberry') || ua.includes('windows phone')) {
    return 'mobile';
  }
  if (ua.includes('tablet') || ua.includes('ipad') || ua.includes('kindle')) {
    return 'tablet';
  }
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
    return 'bot';
  }
  return 'desktop';
};

// ✅ PUBLIC ROUTE - Track visitor (NO AUTH)
exports.trackVisitor = async (req, res) => {
  try {
    // Get real IP (works for mobile & browser)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
               req.socket.remoteAddress || 
               req.connection.remoteAddress || 
               'unknown';
    
    const userAgent = req.headers['user-agent'] || 'unknown';
    const deviceType = getDeviceType(userAgent);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check if visitor already exists today
    const existingVisitor = await Visitor.findOne({
      ip: ip,
      date: today
    });
    
    if (!existingVisitor) {
      // ✅ New unique visitor today
      await Visitor.create({
        ip,
        userAgent,
        deviceType,
        date: today
      });
      
      console.log(`✅ NEW visitor: ${ip} (${deviceType}) at ${new Date().toLocaleString()}`);
    } else {
      console.log(`👋 Returning visitor: ${ip} (${deviceType})`);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Visitor tracked' 
    });
  } catch (error) {
    console.error('❌ Visitor tracking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track visitor' 
    });
  }
};

// ✅ PROTECTED ROUTE - Get visitor stats (counselor only)
exports.getVisitorStats = async (req, res) => {
  try {
    // Total unique visitors all time
    const totalAllTime = await Visitor.distinct('ip').countDocuments();
    
    // Today's unique visitors
    const today = new Date().toISOString().split('T')[0];
    const todayUnique = await Visitor.countDocuments({ date: today });
    
    // Device breakdown for today
    const todayDevices = await Visitor.aggregate([
      { $match: { date: today } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);
    
    // Last 7 days data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = await Visitor.countDocuments({ date: dateStr });
      last7Days.push({
        date: dateStr,
        unique: count
      });
    }
    
    res.json({
      totalAllTime,
      todayUnique,
      todayDevices,
      weeklyData: last7Days
    });
  } catch (error) {
    console.error('❌ Get visitor stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get visitor stats' 
    });
  }
};

// ✅ PROTECTED ROUTE - Get today's visitors count
exports.getTodayVisitors = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const count = await Visitor.countDocuments({ date: today });
    
    res.json({ 
      success: true, 
      count 
    });
  } catch (error) {
    console.error('❌ Get today visitors error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get today visitors' 
    });
  }
};
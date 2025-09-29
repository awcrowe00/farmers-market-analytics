// backend/controllers/heatMapController.js
const TrafficData = require('../models/TrafficData');
const Vendor = require('../models/Vendor');

// @desc    Get heat map data for all vendors
// @route   GET /api/heatmap/data
// @access  Private
const getHeatMapData = async (req, res) => {
  try {
    const { date, hour, timeRange } = req.query;
    
    // Build date filter
    let dateFilter = {};
    const now = new Date();
    
    if (timeRange === 'today') {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      dateFilter = { timestamp: { $gte: startOfDay, $lte: endOfDay } };
    } else if (timeRange === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      dateFilter = { timestamp: { $gte: startOfWeek, $lte: now } };
    } else if (timeRange === 'month') {
      const startOfMonth = new Date(now);
      startOfMonth.setDate(now.getDate() - 30);
      dateFilter = { timestamp: { $gte: startOfMonth, $lte: now } };
    }
    
    // Add hour filter if specified
    if (hour) {
      dateFilter.hourOfDay = parseInt(hour);
    }
    
    // Get all vendors with their traffic data
    const vendors = await Vendor.find({ isActive: true }).lean();
    
    const heatMapData = await Promise.all(
      vendors.map(async (vendor) => {
        // Get traffic data for this vendor
        const trafficData = await TrafficData.find({
          vendorId: vendor._id,
          ...dateFilter
        }).lean();
        
        // Calculate average traffic
        const totalCustomers = trafficData.reduce((sum, data) => sum + data.customerCount, 0);
        const totalDwellTime = trafficData.reduce((sum, data) => sum + (data.dwellTime || 0), 0);
        const dataPoints = trafficData.length;
        
        const avgCustomers = dataPoints > 0 ? totalCustomers / dataPoints : 0;
        const avgDwellTime = dataPoints > 0 ? totalDwellTime / dataPoints : 0;
        
        // Calculate traffic intensity (0-100 scale)
        // You can adjust this formula based on your needs
        const maxExpectedCustomers = 50; // Adjust based on your market
        const trafficIntensity = Math.min((avgCustomers / maxExpectedCustomers) * 100, 100);
        
        return {
          id: vendor._id,
          name: vendor.name,
          category: vendor.category,
          boothNumber: vendor.boothNumber,
          location: vendor.location || { x: 0, y: 0 }, // Default location if not set
          traffic: trafficIntensity,
          avgCustomers: Math.round(avgCustomers),
          avgDwellTime: Math.round(avgDwellTime),
          totalDataPoints: dataPoints,
          recentData: trafficData.slice(-5) // Last 5 data points for trends
        };
      })
    );
    
    res.json({
      success: true,
      data: heatMapData,
      metadata: {
        dateRange: dateFilter,
        totalVendors: vendors.length,
        timestamp: new Date()
      }
    });
    
  } catch (error) {
    console.error('Heat map data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get traffic trends for heat map
// @route   GET /api/heatmap/trends
// @access  Private
const getTrafficTrends = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { hours } = req.query; // Number of hours to look back
    
    const hoursBack = parseInt(hours) || 24;
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hoursBack);
    
    const trends = await TrafficData.aggregate([
      {
        $match: {
          vendorId: require('mongoose').Types.ObjectId(vendorId),
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          avgCustomers: { $avg: '$customerCount' },
          avgDwellTime: { $avg: '$dwellTime' },
          totalSales: { $sum: '$sales.estimated' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
    
    res.json({
      success: true,
      data: trends,
      vendorId
    });
    
  } catch (error) {
    console.error('Traffic trends error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get market layout with real vendor positions
// @route   GET /api/heatmap/layout
// @access  Private
const getMarketLayout = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true })
      .select('name category boothNumber location')
      .lean();
    
    // If vendors don't have locations set, assign default grid positions
    const vendorsWithPositions = vendors.map((vendor, index) => {
      if (!vendor.location || (!vendor.location.x && !vendor.location.y)) {
        // Create a grid layout if no positions are set
        const gridCols = Math.ceil(Math.sqrt(vendors.length));
        const gridSpacing = 100;
        const startX = 100;
        const startY = 100;
        
        const row = Math.floor(index / gridCols);
        const col = index % gridCols;
        
        return {
          ...vendor,
          location: {
            x: startX + (col * gridSpacing),
            y: startY + (row * gridSpacing)
          }
        };
      }
      
      return vendor;
    });
    
    // Add market landmarks/facilities
    const landmarks = [
      { id: 'info', name: 'Information Booth', x: 350, y: 250, category: 'info', isLandmark: true },
      { id: 'seating', name: 'Seating Area', x: 250, y: 250, category: 'seating', isLandmark: true },
      { id: 'restroom', name: 'Restrooms', x: 450, y: 250, category: 'facilities', isLandmark: true }
    ];
    
    res.json({
      success: true,
      data: {
        vendors: vendorsWithPositions,
        landmarks,
        dimensions: { width: 800, height: 500 }
      }
    }); 
    
  } catch (error) {
    console.error('Market layout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getHeatMapData,
  getTrafficTrends,
  getMarketLayout
};

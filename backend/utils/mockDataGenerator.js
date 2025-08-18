// backend/utils/mockDataGenerator.js
const TrafficData = require('../models/TrafficData');
const Vendor = require('../models/Vendor');

const weatherConditions = ['sunny', 'cloudy', 'rainy', 'windy'];
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const generateMockTrafficData = async () => {
  try {
    // Get all vendors
    const vendors = await Vendor.find();
    
    if (vendors.length === 0) {
      console.log('No vendors found. Create vendors first.');
      return;
    }

    const mockData = [];
    const now = new Date();
    
    // Generate data for last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate hourly data for market hours (8 AM to 6 PM)
      for (let hour = 8; hour <= 18; hour++) {
        date.setHours(hour, 0, 0, 0);
        
        vendors.forEach(vendor => {
          // Simulate realistic traffic patterns
          let baseTraffic = Math.floor(Math.random() * 20) + 5;
          
          // Weekend boost
          if (date.getDay() === 6 || date.getDay() === 0) {
            baseTraffic *= 1.5;
          }
          
          // Peak hours (10 AM - 2 PM)
          if (hour >= 10 && hour <= 14) {
            baseTraffic *= 1.3;
          }
          
          // Weather impact
          const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
          if (weather === 'rainy') {
            baseTraffic *= 0.6;
          } else if (weather === 'sunny') {
            baseTraffic *= 1.2;
          }
          
          mockData.push({
            vendorId: vendor._id,
            timestamp: new Date(date),
            customerCount: Math.floor(baseTraffic),
            dwellTime: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
            weather: {
              temperature: Math.floor(Math.random() * 30) + 50, // 50-80°F
              condition: weather,
              humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
            },
            dayOfWeek: days[date.getDay()],
            hourOfDay: hour,
            sales: {
              estimated: baseTraffic * (Math.random() * 15 + 5), // $5-20 per customer
            }
          });
        });
      }
    }
    
    await TrafficData.insertMany(mockData);
    console.log(`Generated ${mockData.length} mock traffic data points`);
    
  } catch (error) {
    console.error('Error generating mock data:', error);
  }
};

module.exports = { generateMockTrafficData };
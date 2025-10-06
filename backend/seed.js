const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const TrafficData = require('../models/TrafficData');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create sample vendors
    const sampleVendors = [
      { name: "Fresh Produce Farm", category: "produce", boothNumber: "A1", location: { x: 150, y: 100 } },
      { name: "Artisan Bread Co", category: "bakery", boothNumber: "A2", location: { x: 250, y: 100 } },
      { name: "Honey & Hives", category: "honey", boothNumber: "A3", location: { x: 350, y: 100 } },
      { name: "Petal Pushers", category: "flowers", boothNumber: "A4", location: { x: 450, y: 100 } },
      { name: "Handmade Crafts", category: "crafts", boothNumber: "A5", location: { x: 550, y: 100 } },
      { name: "Mountain Dairy", category: "dairy", boothNumber: "B1", location: { x: 150, y: 200 } },
      { name: "Organic Greens", category: "produce", boothNumber: "B2", location: { x: 250, y: 200 } },
      { name: "Maple Grove", category: "other", boothNumber: "B3", location: { x: 350, y: 200 } },
      { name: "Hot Tamales", category: "prepared_food", boothNumber: "B4", location: { x: 450, y: 200 } },
      { name: "Berry Bliss Jams", category: "other", boothNumber: "B5", location: { x: 550, y: 200 } },
      { name: "Pottery Place", category: "crafts", boothNumber: "B6", location: { x: 650, y: 200 } },
      { name: "Sunrise Apples", category: "produce", boothNumber: "C1", location: { x: 150, y: 300 } },
      { name: "Sourdough Sam's", category: "bakery", boothNumber: "C2", location: { x: 250, y: 300 } },
      { name: "Lavender Dreams", category: "flowers", boothNumber: "C3", location: { x: 350, y: 300 } },
      { name: "Coffee Corner", category: "prepared_food", boothNumber: "C4", location: { x: 450, y: 300 } },
      { name: "Creamery Delights", category: "dairy", boothNumber: "C5", location: { x: 550, y: 300 } },
      { name: "Pickled Everything", category: "other", boothNumber: "C6", location: { x: 650, y: 300 } },
    ];

    console.log('Creating vendors...');
    const vendors = await Vendor.insertMany(sampleVendors);
    console.log(`Created ${vendors.length} vendors`);

    // Generate traffic data for the last 7 days
    console.log('Generating traffic data...');
    const trafficData = [];
    const now = new Date();

    for (let day = 7; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      
      // Only weekends (assuming farmer's market is Sat & Sun)
      if (date.getDay() !== 0 && date.getDay() !== 6) continue;

      // Generate data for market hours (8 AM to 6 PM)
      for (let hour = 8; hour <= 18; hour++) {
        date.setHours(hour, 0, 0, 0);

        vendors.forEach(vendor => {
          // Base traffic based on category
          let baseTraffic = 10;
          if (vendor.category === 'prepared_food') baseTraffic = 25;
          else if (vendor.category === 'produce') baseTraffic = 22;
          else if (vendor.category === 'bakery') baseTraffic = 20;
          else if (vendor.category === 'dairy') baseTraffic = 18;
          else if (vendor.category === 'flowers') baseTraffic = 15;
          else if (vendor.category === 'honey') baseTraffic = 12;
          else if (vendor.category === 'crafts') baseTraffic = 8;

          // Add variation
          baseTraffic += Math.floor(Math.random() * 10);

          // Weekend boost
          if (date.getDay() === 6 || date.getDay() === 0) {
            baseTraffic *= 1.3;
          }

          // Peak hours boost (10 AM - 2 PM)
          if (hour >= 10 && hour <= 14) {
            baseTraffic *= 1.5;
          }

          // Weather effect
          const weatherConditions = ['sunny', 'cloudy', 'rainy'];
          const weather = weatherConditions[Math.floor(Math.random() * 3)];
          let weatherMultiplier = 1;
          if (weather === 'rainy') weatherMultiplier = 0.6;
          else if (weather === 'sunny') weatherMultiplier = 1.2;

          const finalTraffic = Math.floor(baseTraffic * weatherMultiplier);

          trafficData.push({
            vendorId: vendor._id,
            timestamp: new Date(date),
            customerCount: Math.max(0, finalTraffic),
            dwellTime: Math.floor(Math.random() * 240) + 60, // 1-5 minutes
            weather: {
              temperature: Math.floor(Math.random() * 25) + 55, // 55-80°F
              condition: weather,
              humidity: Math.floor(Math.random() * 40) + 30,
            },
            dayOfWeek: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()],
            hourOfDay: hour,
            sales: {
              estimated: finalTraffic * (Math.random() * 12 + 8), // $8-20 per customer
            }
          });
        });
      }
    }

    await TrafficData.insertMany(trafficData);
    console.log(`Created ${trafficData.length} traffic data points`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${vendors.length} vendors`);
    console.log(`   - ${trafficData.length} traffic records`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Create sample events for the past 30 days
    const events = [];
    const now = new Date();
    
    const eventNames = [
      'Farmers Market Opening Day',
      'Live Music Saturday',
      'Cooking Demonstration',
      'Kids Activities Day',
      'Seasonal Festival',
      'Local Artist Showcase',
      'Farm-to-Table Workshop',
    ];

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Create events on weekends
      if (date.getDay() === 6 || date.getDay() === 0) {
        events.push({
          name: eventNames[Math.floor(Math.random() * eventNames.length)],
          date: date,
          attendees: Math.floor(Math.random() * 200) + 50,
          description: 'Special market event',
          location: 'Main Market Square',
        });
      }
    }

    await Event.insertMany(events);
    console.log(`✅ Created ${events.length} sample events`);

    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
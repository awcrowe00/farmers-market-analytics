const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const connectDB = require('./config/database');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const EventData = require('./models/EventData');
const TrafficData = require('./models/TrafficData');
const { generateMockTrafficData, generateMockEventData } = require('./utils/mockDataGenerator');

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Vendor.deleteMany();
    await EventData.deleteMany();
    await TrafficData.deleteMany();

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        company: 'Company A',
      },
      {
        name: 'Vendor A1',
        email: 'vendorA1@example.com',
        password: 'password123',
        role: 'vendor',
        company: 'Company A',
      },
      {
        name: 'Vendor B1',
        email: 'vendorB1@example.com',
        password: 'password123',
        role: 'vendor',
        company: 'Company B',
      },
      {
        name: 'Market Manager A',
        email: 'managerA@example.com',
        password: 'password123',
        role: 'market_manager',
        company: 'Company A',
      },
      {
        name: 'Honey Man',
        email: 'honeyMan@example.com',
        password: 'password123',
        role: 'market_manager',
        company: 'Company C1',
      },
    ]);

    const vendorA1 = users.find(user => user.email === 'vendorA1@example.com');
    const vendorB1 = users.find(user => user.email === 'vendorB1@example.com');
    const vendorC1 = users.find(user => user.email === 'vendorC1@example.com');

    await Vendor.insertMany([
      {
        name: 'Fresh Produce A',
        category: 'produce',
        boothNumber: 'A1',
        location: { x: 10, y: 20 },
        owner: vendorA1._id,
        company: 'Company A',
        products: [{ name: 'Apples', category: 'fruit', averagePrice: 2.5 }]
      },
      {
        name: 'Baked Goods B',
        category: 'bakery',
        boothNumber: 'B1',
        location: { x: 30, y: 40 },
        owner: vendorB1._id,
        company: 'Company B',
        products: [{ name: 'Bread', category: 'bread', averagePrice: 4.0 }]
      },
      {
        name: 'Honey C',
        category: 'honey',
        boothNumber: 'C1',
        location: { x: 50, y: 60 },
        owner: vendorC1._id,
        company: 'Company C',
        products: [{ name: 'Honey', category: 'Honey', averagePrice: 8.0 }]
      },
    ]);
    
    await generateMockTrafficData();
    await generateMockEventData();

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Vendor.deleteMany();
    await EventData.deleteMany();
    await TrafficData.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

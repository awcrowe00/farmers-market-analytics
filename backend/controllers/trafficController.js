const TrafficData = require('../models/TrafficData');

exports.getAllTrafficData = async (req, res) => {
  try {
    const trafficData = await TrafficData.find({ company: req.user.company });
    res.status(200).json(trafficData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTrafficData = async (req, res) => {
  const trafficData = new TrafficData({
    vendorId: req.body.vendorId,
    company: req.user.company,
    timestamp: req.body.timestamp,
    customerCount: req.body.customerCount,
    dwellTime: req.body.dwellTime,
    weather: req.body.weather,
    dayOfWeek: req.body.dayOfWeek,
    hourOfDay: req.body.hourOfDay,
    sales: req.body.sales,
  });

  try {
    const newTrafficData = await trafficData.save();
    res.status(201).json(newTrafficData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

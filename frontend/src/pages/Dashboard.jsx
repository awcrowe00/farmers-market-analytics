// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TrafficChart from '../components/Charts/TrafficChart';
import WeatherChart from '../components/Charts/WeatherChart';
import EventChart from '../components/Charts/EventChart';
import StatsCard from '../components/Dashboard/StatsCard';
import { Users, TrendingUp, Cloud, Clock } from 'lucide-react';
import eventService from '../services/eventService';

const Dashboard = () => {
  const { user } = useAuth();
  const [trafficData, setTrafficData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    avgDwellTime: 0,
    peakHour: '',
    weatherImpact: 0,
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Mock data for now
      const mockTrafficData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        visitors: Math.floor(Math.random() * 100) + 50,
        sales: Math.floor(Math.random() * 500) + 200,
        weather: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      }));
      
      setTrafficData(mockTrafficData);
      setStats({
        totalVisitors: mockTrafficData.reduce((sum, day) => sum + day.visitors, 0),
        avgDwellTime: 4.2,
        peakHour: '11:00 AM',
        weatherImpact: 15,
      });
      setLoading(false);
    }, 1000);

    const fetchEventData = async () => {
      try {
        const data = await eventService.getEventData();
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    fetchEventData();

  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's your farmers market analytics dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={Users}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Avg. Dwell Time"
          value={`${stats.avgDwellTime} min`}
          icon={Clock}
          trend="+0.3 min"
          trendUp={true}
        />
        <StatsCard
          title="Peak Hour"
          value={stats.peakHour}
          icon={TrendingUp}
          trend="Consistent"
          trendUp={true}
        />
        <StatsCard
          title="Weather Impact"
          value={`${stats.weatherImpact}%`}
          icon={Cloud}
          trend="-5%"
          trendUp={false}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Weekly Traffic Trend</h3>
          <TrafficChart data={trafficData} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Weather Impact Analysis</h3>
          <WeatherChart data={trafficData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Event Attendees Over Time</h3>
          <EventChart data={eventData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
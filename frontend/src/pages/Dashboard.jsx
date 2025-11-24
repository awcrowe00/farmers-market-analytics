// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TrafficChart from '../components/Charts/TrafficChart';
import WeatherChart from '../components/Charts/WeatherChart';
import EventChart from '../components/Charts/EventChart';
import DateRangePicker from '../components/Charts/DatePicker';
import StatsCard from '../components/Dashboard/StatsCard';
import FarmersMarketHeatMap from '../components/HeatMap/FarmersMarketHeatMap';
import { Users, TrendingUp, Cloud, Clock } from 'lucide-react';
// import eventService from '../services/eventService';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [trafficData, setTrafficData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    avgDwellTime: 0,
    peakHour: '',
    weatherImpact: 0,
  });

  // Refresh user data on mount to get latest enabledGraphs from MongoDB
  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, [refreshUser]);

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

    // const fetchEventData = async () => {
    //   try {
    //     const data = await eventService.getEventData();
    //     setEventData(data);
    //   } catch (error) {
    //     console.error('Error fetching event data:', error);
    //   }
    // };
    // fetchEventData();

  }, []);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Filter data based on date range
  const filteredTrafficData = trafficData.filter(item => {
    const itemDate = new Date(item.date);
    return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
  });

  const filteredEventData = eventData.filter(item => {
    const itemDate = new Date(item.date);
    return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '16rem',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef7f7', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '0.5rem'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#dc2626',
          marginBottom: '0.5rem'
        }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ 
          color: '#6b7280',
          margin: 0
        }}>
          Here's your farmers market analytics dashboard
        </p>
      </div>

      {(!user?.enabledGraphs || user.enabledGraphs.heatMap !== false) && (
        <div className="col-span-full">
          <FarmersMarketHeatMap />
        </div>
      )}

      {/* Date Range Picker */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '0.5rem'
      }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          marginBottom: '1rem', 
          color: '#dc2626'
        }}>Select Date Range</h3>
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '0.5rem'
      }}>
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
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1.5rem'
      }}>
        {(!user?.enabledGraphs || user.enabledGraphs.trafficChart !== false) && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem', 
              color: '#dc2626'
            }}>Weekly Traffic Trend</h3>
            <TrafficChart data={filteredTrafficData} />
          </div>
        )}
        
        {(!user?.enabledGraphs || user.enabledGraphs.weatherChart !== false) && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem', 
              color: '#dc2626'
            }}>Weather Impact Analysis</h3>
            <WeatherChart data={filteredTrafficData} />
          </div>
        )}

        {(!user?.enabledGraphs || user.enabledGraphs.eventChart !== false) && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem', 
              color: '#dc2626'
            }}>Event Attendees Over Time</h3>
            <EventChart data={filteredEventData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
// frontend/src/components/Charts/WeatherChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme

// Custom tooltip with better contrast
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    const textColor = theme === 'dark' ? '#F3F4F6' : '#1F2937'; // High contrast text
    const labelColor = theme === 'dark' ? '#D1D5DB' : '#374151'; // Darker gray for better readability
    const backgroundColor = theme === 'dark' ? '#2D2D2D' : '#FFFFFF';
    const borderColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    
    return (
      <div style={{
        backgroundColor: backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '0.5rem',
        padding: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <p style={{ 
          margin: '0 0 0.5rem 0', 
          color: labelColor,
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {label}
        </p>
        <p style={{ 
          margin: 0, 
          color: textColor,
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          Avg Visitors : {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const WeatherChart = ({ data }) => {
  const { theme } = useTheme();
  const barFillColor = theme === 'dark' ? '#A3E635' : '#65A30D'; // primary-400 for dark, primary-600 for light
  const gridStrokeColor = theme === 'dark' ? '#3F6212' : '#D1D5DB'; // primary-800 for dark, gray-300 for light
  const axisTextColor = '#1F2937'; // Always dark text for white background

  // Process data to group by weather condition
  const weatherData = data.reduce((acc, day) => {
    const existing = acc.find(item => item.weather === day.weather);
    if (existing) {
      existing.visitors += day.visitors;
      existing.count += 1;
    } else {
      acc.push({
        weather: day.weather,
        visitors: day.visitors,
        count: 1,
      });
    }
    return acc;
  }, []).map(item => ({
    ...item,
    avgVisitors: Math.round(item.visitors / item.count),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={weatherData}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
        <XAxis dataKey="weather" stroke={axisTextColor} />
        <YAxis stroke={axisTextColor} />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Bar 
          dataKey="avgVisitors" 
          fill={barFillColor} 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;

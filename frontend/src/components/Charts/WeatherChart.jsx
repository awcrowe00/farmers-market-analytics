// frontend/src/components/Charts/WeatherChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme

const WeatherChart = ({ data }) => {
  const { theme } = useTheme();
  const barFillColor = theme === 'dark' ? '#A3E635' : '#65A30D'; // primary-400 for dark, primary-600 for light
  const gridStrokeColor = theme === 'dark' ? '#3F6212' : '#D1D5DB'; // primary-800 for dark, gray-300 for light
  const axisTextColor = theme === 'dark' ? '#FFFFFF' : '#1F2937'; // white for dark, gray-900 for light

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
        <Tooltip 
          formatter={(value, name) => [value, 'Avg Visitors']}
        />
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

// frontend/src/components/Charts/WeatherChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeatherChart = ({ data }) => {
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="weather" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [value, 'Avg Visitors']}
        />
        <Bar 
          dataKey="avgVisitors" 
          fill="#22c55e" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;

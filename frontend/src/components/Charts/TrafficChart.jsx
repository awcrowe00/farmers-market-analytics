// frontend/src/components/Charts/TrafficChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme

const TrafficChart = ({ data }) => {
  const { theme } = useTheme();
  const chartStrokeColor = theme === 'dark' ? '#A3E635' : '#65A30D'; // primary-400 for dark, primary-600 for light
  const gridStrokeColor = theme === 'dark' ? '#3F6212' : '#D1D5DB'; // primary-800 for dark, gray-300 for light
  const axisTextColor = theme === 'dark' ? '#FFFFFF' : '#1F2937'; // white for dark, gray-900 for light

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
        <XAxis dataKey="date" stroke={axisTextColor} />
        <YAxis stroke={axisTextColor} />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="visitors" 
          stroke={chartStrokeColor} 
          strokeWidth={2}
          dot={{ fill: chartStrokeColor, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrafficChart;

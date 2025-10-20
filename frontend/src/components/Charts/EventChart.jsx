import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme

const EventChart = ({ data }) => {
  const { theme } = useTheme();
  const chartStrokeColor = theme === 'dark' ? '#FB923C' : '#EA580C'; // secondary-400 for dark, secondary-600 for light
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
          dataKey="count"
          stroke={chartStrokeColor}
          strokeWidth={2}
          dot={{ fill: chartStrokeColor, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EventChart;


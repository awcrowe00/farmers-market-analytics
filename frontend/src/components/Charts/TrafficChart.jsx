// frontend/src/components/Charts/TrafficChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
          visitors : {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const TrafficChart = ({ data }) => {
  const { theme } = useTheme();
  const chartStrokeColor = theme === 'dark' ? '#A3E635' : '#65A30D'; // primary-400 for dark, primary-600 for light
  const gridStrokeColor = theme === 'dark' ? '#3F6212' : '#D1D5DB'; // primary-800 for dark, gray-300 for light
  const axisTextColor = '#1F2937'; // Always dark text for white background

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
        <XAxis dataKey="date" stroke={axisTextColor} />
        <YAxis stroke={axisTextColor} />
        <Tooltip content={<CustomTooltip theme={theme} />} />
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

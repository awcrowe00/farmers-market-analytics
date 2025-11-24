import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const EventChart = ({ data }) => {
  console.log('EventChart received data:', data); // Debug log
  
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        color: '#6b7280'
      }}>
        No event data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          style={{ fontSize: '12px' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          style={{ fontSize: '12px' }}
          label={{ value: 'Attendees', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          formatter={(value) => [value, 'Attendees']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="attendees" 
          name="Event Attendees"
          stroke="#dc2626" 
          strokeWidth={3}
          dot={{ fill: '#dc2626', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EventChart;
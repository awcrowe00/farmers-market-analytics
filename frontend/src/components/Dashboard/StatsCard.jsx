// frontend/src/components/Dashboard/StatsCard.js
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#6b7280',
            margin: '0 0 0.5rem 0'
          }}>{title}</p>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>{value}</p>
        </div>
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fef2f2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626' }} />
        </div>
      </div>
      {trend && (
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          {trendUp ? (
            <TrendingUp style={{ width: '1rem', height: '1rem', color: '#16a34a', marginRight: '0.25rem' }} />
          ) : (
            <TrendingDown style={{ width: '1rem', height: '1rem', color: '#dc2626', marginRight: '0.25rem' }} />
          )}
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: trendUp ? '#16a34a' : '#dc2626'
          }}>
            {trend}
          </span>
          <span style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginLeft: '0.25rem'
          }}>vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
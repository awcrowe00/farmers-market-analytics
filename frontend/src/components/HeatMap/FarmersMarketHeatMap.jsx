// frontend/src/components/HeatMap/FarmersMarketHeatMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, TrendingUp, Calendar, RefreshCw, AlertCircle, Map } from 'lucide-react';
import heatMapService from '../../services/heatMapService';
import { useAuth } from '../../context/AuthContext';

const FarmersMarketHeatMap = () => {
  const canvasRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [hoveredVendor, setHoveredVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heatMapData, setHeatMapData] = useState([]);
  const [marketLayout, setMarketLayout] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showTopography, setShowTopography] = useState(true);

  const defaultDimensions = { width: 800, height: 500 };
  
  const timeMultipliers = {
    8: 0.3, 9: 0.5, 10: 0.8, 11: 0.95, 12: 1.0, 13: 0.9,
    14: 0.85, 15: 0.7, 16: 0.4, 17: 0.2, 18: 0.1, 19: 0.05
  };

  useEffect(() => {
    fetchMarketLayout();
  }, []);

  useEffect(() => {
    if (marketLayout) {
      fetchHeatMapData();
    }
  }, [selectedTimeRange, selectedHour, marketLayout]);

  const fetchMarketLayout = async () => {
    try {
      setLoading(true);
      const response = await heatMapService.getMarketLayout();
      setMarketLayout(response.data);
    } catch (error) {
      console.error('Failed to fetch market layout:', error);
      setError('Failed to load market layout. Using default layout.');
      setMarketLayout({
        vendors: [],
        landmarks: [],
        dimensions: defaultDimensions
      });
    }
  };

  const fetchHeatMapData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await heatMapService.getHeatMapData(selectedTimeRange, selectedHour);
      setHeatMapData(response.data);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Failed to fetch heat map data:', error);
      setError('Failed to load traffic data. Please try again.');
      
      if (marketLayout && marketLayout.vendors.length > 0) {
        const mockData = marketLayout.vendors.map((vendor) => ({
          ...vendor,
          traffic: Math.random() * 100,
          avgCustomers: Math.floor(Math.random() * 30) + 5,
          avgDwellTime: Math.floor(Math.random() * 300) + 60,
          totalDataPoints: Math.floor(Math.random() * 50) + 10
        }));
        setHeatMapData(mockData);
      }
    } finally {
      setLoading(false);
    }
  };

  const getHeatColor = (traffic, hour) => {
    const adjustedTraffic = traffic * (timeMultipliers[hour] || 0.5);
    const intensity = Math.min(adjustedTraffic / 100, 1);
    
    if (intensity < 0.2) return `rgba(0, 255, 0, ${0.1 + intensity * 0.3})`;
    if (intensity < 0.5) return `rgba(255, 255, 0, ${0.2 + intensity * 0.4})`;
    if (intensity < 0.8) return `rgba(255, 165, 0, ${0.3 + intensity * 0.5})`;
    return `rgba(255, 0, 0, ${0.4 + intensity * 0.6})`;
  };

  const drawTopography = (ctx, width, height) => {
    const grassGradient = ctx.createLinearGradient(0, 0, 0, height);
    grassGradient.addColorStop(0, '#e8f5e9');
    grassGradient.addColorStop(0.5, '#c8e6c9');
    grassGradient.addColorStop(1, '#a5d6a7');
    ctx.fillStyle = grassGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(76, 175, 80, 0.15)';
    ctx.lineWidth = 2;
    
    for (let y = 50; y < height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < width; x += 20) {
        const wave = Math.sin(x / 50) * 10;
        ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
    ctx.fillRect(50, 140, width - 100, 30);
    ctx.fillRect(50, 240, width - 100, 30);
    ctx.fillRect(50, 340, width - 100, 30);
    ctx.fillRect(140, 50, 25, height - 100);
    ctx.fillRect(340, 50, 25, height - 100);
    ctx.fillRect(540, 50, 25, height - 100);

    ctx.fillStyle = 'rgba(101, 67, 33, 0.1)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const onHorizontalPath = (y > 140 && y < 170) || (y > 240 && y < 270) || (y > 340 && y < 370);
      const onVerticalPath = (x > 140 && x < 165) || (x > 340 && x < 365) || (x > 540 && x < 565);
      if (onHorizontalPath || onVerticalPath) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    const drawTree = (x, y, size) => {
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(x - size/6, y, size/3, size);
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'rgba(129, 199, 132, 0.6)';
      ctx.beginPath();
      ctx.arc(x - size/4, y - size/4, size * 0.4, 0, 2 * Math.PI);
      ctx.fill();
    };

    const treePositions = [
      { x: 40, y: 60 }, { x: 760, y: 60 }, { x: 40, y: 180 }, { x: 760, y: 180 },
      { x: 40, y: 300 }, { x: 760, y: 300 }, { x: 40, y: 420 }, { x: 760, y: 420 },
      { x: 150, y: 30 }, { x: 400, y: 30 }, { x: 650, y: 30 },
      { x: 150, y: 470 }, { x: 400, y: 470 }, { x: 650, y: 470 }
    ];

    treePositions.forEach(pos => drawTree(pos.x, pos.y, 15));

    ctx.fillStyle = 'rgba(121, 85, 72, 0.8)';
    ctx.fillRect(width/2 - 85, 10, 170, 25);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MARKET ENTRANCE', width/2, 27);

    ctx.strokeStyle = 'rgba(158, 158, 158, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(620, 380, 150, 100);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(97, 97, 97, 0.3)';
    ctx.fillRect(620, 380, 150, 100);
    ctx.fillStyle = '#616161';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PARKING', 695, 435);
  };

  useEffect(() => {
    if (!marketLayout || heatMapData.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = marketLayout.dimensions || defaultDimensions;
    
    ctx.clearRect(0, 0, width, height);
    
    if (showTopography) {
      drawTopography(ctx, width, height);
    } else {
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#e9ecef';
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
    
    heatMapData.forEach(vendor => {
      if (!vendor.location) return;
      const traffic = vendor.traffic || 0;
      const radius = 30 + (traffic / 100) * 20;
      const gradient = ctx.createRadialGradient(
        vendor.location.x, vendor.location.y, 0,
        vendor.location.x, vendor.location.y, radius
      );
      const heatColor = getHeatColor(traffic, selectedHour);
      gradient.addColorStop(0, heatColor);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(vendor.location.x, vendor.location.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    heatMapData.forEach(vendor => {
      if (!vendor.location) return;
      const isHovered = hoveredVendor === vendor.id || hoveredVendor === vendor._id;
      const boothSize = 15;
      const categoryColors = {
        produce: '#22c55e', bakery: '#f59e0b', dairy: '#3b82f6',
        honey: '#fbbf24', flowers: '#ec4899', crafts: '#8b5cf6',
        prepared_food: '#ef4444', other: '#6b7280'
      };
      
      if (showTopography) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(vendor.location.x - boothSize/2 + 2, vendor.location.y - boothSize/2 + 2, boothSize, boothSize);
      }
      
      ctx.fillStyle = isHovered ? '#007bff' : (categoryColors[vendor.category] || '#6b7280');
      ctx.fillRect(vendor.location.x - boothSize/2, vendor.location.y - boothSize/2, boothSize, boothSize);
      ctx.strokeStyle = isHovered ? '#0056b3' : '#374151';
      ctx.lineWidth = 2;
      ctx.strokeRect(vendor.location.x - boothSize/2, vendor.location.y - boothSize/2, boothSize, boothSize);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(vendor.boothNumber || vendor.name.substring(0, 3).toUpperCase(), vendor.location.x, vendor.location.y + 2);
    });
    
    drawLegend(ctx);
  }, [selectedHour, hoveredVendor, heatMapData, marketLayout, showTopography]);

  const drawLegend = (ctx) => {
    const legendX = 20, legendY = 400;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(legendX, legendY, 200, 80);
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.strokeRect(legendX, legendY, 200, 80);
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Traffic Intensity', legendX + 10, legendY + 20);
    
    const legendItems = [
      { color: 'rgba(0, 255, 0, 0.4)', label: 'Low' },
      { color: 'rgba(255, 255, 0, 0.6)', label: 'Medium' },
      { color: 'rgba(255, 165, 0, 0.8)', label: 'High' },
      { color: 'rgba(255, 0, 0, 1)', label: 'Very High' }
    ];
    
    legendItems.forEach((item, index) => {
      const y = legendY + 35 + (index * 10);
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX + 10, y - 5, 15, 8);
      ctx.fillStyle = '#212529';
      ctx.font = '10px Arial';
      ctx.fillText(item.label, legendX + 30, y);
    });
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickedVendor = heatMapData.find(vendor => {
      if (!vendor.location) return false;
      const distance = Math.sqrt(Math.pow(x - vendor.location.x, 2) + Math.pow(y - vendor.location.y, 2));
      return distance <= 20;
    });
    
    if (clickedVendor) {
      const vendorId = clickedVendor.id || clickedVendor._id;
      setHoveredVendor(hoveredVendor === vendorId ? null : vendorId);
    } else {
      setHoveredVendor(null);
    }
  };

  const getVendorStats = (vendorId) => {
    const vendor = heatMapData.find(v => (v.id || v._id) === vendorId);
    if (!vendor) return null;
    const currentTraffic = Math.round(vendor.traffic * (timeMultipliers[selectedHour] || 0.5));
    return {
      ...vendor,
      currentTraffic,
      status: currentTraffic > 80 ? 'Very Busy' : currentTraffic > 60 ? 'Busy' : currentTraffic > 40 ? 'Moderate' : 'Quiet'
    };
  };

  const handleRefresh = () => {
    fetchHeatMapData();
  };

  if (!isAuthenticated || !user) {
    return (
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p style={{ color: '#6b7280' }}>Please log in to view the heat map.</p>
        </div>
      </div>
    );
  }

  if (loading && !heatMapData.length) {
    return (
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
          <div style={{ width: '3rem', height: '3rem', border: '3px solid #e5e7eb', borderTop: '3px solid #16a34a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span style={{ marginLeft: '1rem', color: '#6b7280' }}>Loading heat map data...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Left Sidebar */}
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', color: '#111827', margin: 0 }}>
                <MapPin style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#16a34a' }} />
                Market Heat Map
              </h3>
              <button
                onClick={handleRefresh}
                disabled={loading}
                style={{ padding: '0.5rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
                title="Refresh data"
              >
                <RefreshCw style={{ width: '1rem', height: '1rem' }} className={loading ? 'spin-animation' : ''} />
              </button>
            </div>
            
            {error && (
              <div style={{ backgroundColor: '#fefce8', border: '1px solid #fde047', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <AlertCircle style={{ width: '1rem', height: '1rem', color: '#d97706', marginRight: '0.5rem', marginTop: '0.125rem' }} />
                  <div style={{ fontSize: '0.875rem', color: '#92400e' }}>{error}</div>
                </div>
              </div>
            )}
            
            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  <Calendar style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.25rem' }} />
                  Time Range
                </label>
                <select 
                  value={selectedTimeRange} 
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white', color: '#111827' }}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  Hour: {selectedHour}:00
                </label>
                <input
                  type="range"
                  min="8"
                  max="19"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.25rem', color: '#6b7280' }}>
                  <span>8AM</span>
                  <span>1PM</span>
                  <span>7PM</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  <Map style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                  Topography
                </label>
                <button
                  onClick={() => setShowTopography(!showTopography)}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    height: '1.5rem',
                    width: '2.75rem',
                    alignItems: 'center',
                    borderRadius: '9999px',
                    backgroundColor: showTopography ? '#16a34a' : '#e5e7eb',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      height: '1rem',
                      width: '1rem',
                      transform: showTopography ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                      borderRadius: '9999px',
                      backgroundColor: 'white',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
          
          {/* Vendor Details */}
          {hoveredVendor && (() => {
            const stats = getVendorStats(hoveredVendor);
            return stats ? (
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>Vendor Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                  <div><strong style={{ color: '#111827' }}>{stats.name}</strong></div>
                  {stats.boothNumber && <div>Booth: {stats.boothNumber}</div>}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Users style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                    Traffic: {Math.round(stats.traffic)}%
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                    Status: <span style={{ 
                      marginLeft: '0.25rem',
                      fontWeight: '500',
                      color: stats.status === 'Very Busy' ? '#dc2626' :
                             stats.status === 'Busy' ? '#ea580c' :
                             stats.status === 'Moderate' ? '#ca8a04' : '#16a34a'
                    }}>{stats.status}</span>
                  </div>
                  <div>Category: <span style={{ textTransform: 'capitalize' }}>{stats.category?.replace('_', ' ')}</span></div>
                  {stats.avgCustomers !== undefined && <div>Avg Customers: {stats.avgCustomers}</div>}
                  {stats.avgDwellTime !== undefined && <div>Avg Visit: {Math.round(stats.avgDwellTime/60)}min</div>}
                </div>
              </div>
            ) : null;
          })()}
          
          {/* Stats */}
          <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#14532d' }}>Current Stats</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#166534' }}>
              <div>Total Vendors: {heatMapData.filter(v => !v.isLandmark).length}</div>
              {heatMapData.length > 0 && (
                <>
                  <div>Peak Traffic: {Math.max(...heatMapData.map(v => Math.round(v.traffic * (timeMultipliers[selectedHour] || 0.5))))}%</div>
                  <div>Avg Traffic: {Math.round(heatMapData.reduce((acc, v) => acc + v.traffic * (timeMultipliers[selectedHour] || 0.5), 0) / heatMapData.length)}%</div>
                </>
              )}
              {lastUpdated && (
                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#16a34a' }}>
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Canvas */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' }}>
            <canvas 
              ref={canvasRef}
              width={marketLayout?.dimensions?.width || defaultDimensions.width}
              height={marketLayout?.dimensions?.height || defaultDimensions.height}
              onClick={handleCanvasClick}
              style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer', display: 'block' }}
            />
          </div>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#6b7280' }}>
            Click on vendor booths to see detailed information. Toggle topography to see the market layout with paths, trees, and facilities.
            {heatMapData.length === 0 && ' No traffic data available for the selected time range.'}
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FarmersMarketHeatMap;
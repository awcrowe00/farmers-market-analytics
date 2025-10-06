// frontend/src/components/HeatMap/FarmersMarketHeatMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, TrendingUp, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import heatMapService from '../../services/heatMapService';

const FarmersMarketHeatMap = () => {
  const canvasRef = useRef(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [hoveredVendor, setHoveredVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heatMapData, setHeatMapData] = useState([]);
  const [marketLayout, setMarketLayout] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Default market dimensions
  const defaultDimensions = { width: 800, height: 500 };
  
  // Time-based traffic adjustments (fallback if no real-time data)
  const timeMultipliers = {
    8: 0.3, 9: 0.5, 10: 0.8, 11: 0.95, 12: 1.0, 13: 0.9,
    14: 0.85, 15: 0.7, 16: 0.4, 17: 0.2, 18: 0.1, 19: 0.05
  };

  // Fetch market layout on component mount
  useEffect(() => {
    fetchMarketLayout();
  }, []);

  // Fetch heat map data when filters change
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
      // Set a default layout
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
      
      // Fallback to mock data if real data fails
      if (marketLayout && marketLayout.vendors.length > 0) {
        const mockData = marketLayout.vendors.map((vendor, index) => ({
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

  // Get traffic intensity color
  const getHeatColor = (traffic, hour) => {
    const adjustedTraffic = traffic * (timeMultipliers[hour] || 0.5);
    const intensity = Math.min(adjustedTraffic / 100, 1);
    
    if (intensity < 0.2) return `rgba(0, 255, 0, ${0.1 + intensity * 0.3})`;
    if (intensity < 0.5) return `rgba(255, 255, 0, ${0.2 + intensity * 0.4})`;
    if (intensity < 0.8) return `rgba(255, 165, 0, ${0.3 + intensity * 0.5})`;
    return `rgba(255, 0, 0, ${0.4 + intensity * 0.6})`;
  };

  // Draw the heat map
  useEffect(() => {
    if (!marketLayout || heatMapData.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = marketLayout.dimensions || defaultDimensions;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines for reference
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
    
    // Draw heat zones around vendors
    heatMapData.forEach(vendor => {
      if (!vendor.location) return;
      
      const traffic = vendor.traffic || 0;
      const radius = 30 + (traffic / 100) * 20;
      
      // Create radial gradient for heat effect
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
    
    // Draw vendor booths
    heatMapData.forEach(vendor => {
      if (!vendor.location) return;
      
      const isHovered = hoveredVendor === vendor.id || hoveredVendor === vendor._id;
      const boothSize = 15;
      
      // Booth background - color by category
      const categoryColors = {
        produce: '#22c55e',
        bakery: '#f59e0b',
        dairy: '#3b82f6',
        honey: '#fbbf24',
        flowers: '#ec4899',
        crafts: '#8b5cf6',
        prepared_food: '#ef4444',
        other: '#6b7280'
      };
      
      ctx.fillStyle = isHovered ? '#007bff' : (categoryColors[vendor.category] || '#6b7280');
      ctx.fillRect(
        vendor.location.x - boothSize/2, 
        vendor.location.y - boothSize/2, 
        boothSize, 
        boothSize
      );
      
      // Booth border
      ctx.strokeStyle = isHovered ? '#0056b3' : '#374151';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        vendor.location.x - boothSize/2, 
        vendor.location.y - boothSize/2, 
        boothSize, 
        boothSize
      );
      
      // Booth number/name (abbreviated)
      ctx.fillStyle = '#fff';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        vendor.boothNumber || vendor.name.substring(0, 3).toUpperCase(), 
        vendor.location.x, 
        vendor.location.y + 2
      );
    });
    
    // Draw landmarks
    if (marketLayout.landmarks) {
      marketLayout.landmarks.forEach(landmark => {
        ctx.fillStyle = '#6c757d';
        ctx.fillRect(landmark.x - 10, landmark.y - 10, 20, 20);
        ctx.strokeStyle = '#495057';
        ctx.lineWidth = 1;
        ctx.strokeRect(landmark.x - 10, landmark.y - 10, 20, 20);
        
        // Landmark label
        ctx.fillStyle = '#fff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(landmark.name.charAt(0), landmark.x, landmark.y + 2);
      });
    }
    
    // Draw legend
    drawLegend(ctx);
    
  }, [selectedHour, hoveredVendor, heatMapData, marketLayout]);

  const drawLegend = (ctx) => {
    const legendX = 20;
    const legendY = 400;
    
    // Legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(legendX, legendY, 200, 80);
    ctx.strokeStyle = '#dee2e6';
    ctx.strokeRect(legendX, legendY, 200, 80);
    
    // Legend title
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Traffic Intensity', legendX + 10, legendY + 20);
    
    // Legend colors
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
    
    // Check if click is on a vendor
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

  if (loading && !heatMapData.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-4 text-gray-600">Loading heat map data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row gap-6 text-gray-900 mb-2">
        {/* Controls */}
        <div className="lg:w-1/4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Market Heat Map
              </h3>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">{error}</div>
                </div>
              </div>
            )}
            
            {/* Time Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Time Range
                </label>
                <select 
                  value={selectedTimeRange} 
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hour: {selectedHour}:00
                </label>
                <input
                  type="range"
                  min="8"
                  max="19"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>8AM</span>
                  <span>1PM</span>
                  <span>7PM</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vendor Info */}
          {hoveredVendor && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Vendor Details</h4>
              {(() => {
                const stats = getVendorStats(hoveredVendor);
                return stats ? (
                  <div className="space-y-2 text-sm text-gray-900 mb-2">
                    <div><strong>{stats.name}</strong></div>
                    {stats.boothNumber && <div>Booth: {stats.boothNumber}</div>}
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Traffic: {Math.round(stats.traffic)}%
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Status: <span className={`ml-1 font-medium ${
                        stats.status === 'Very Busy' ? 'text-red-600' :
                        stats.status === 'Busy' ? 'text-orange-600' :
                        stats.status === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                      }`}>{stats.status}</span>
                    </div>
                    <div>Category: <span className="capitalize">{stats.category?.replace('_', ' ')}</span></div>
                    {stats.avgCustomers !== undefined && (
                      <div>Avg Customers: {stats.avgCustomers}</div>
                    )}
                    {stats.avgDwellTime !== undefined && (
                      <div>Avg Visit: {Math.round(stats.avgDwellTime/60)}min</div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
          )}
          
          {/* Quick Stats */}
          <div className="bg-primary-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary-900 mb-2">Current Stats</h4>
            <div className="space-y-1 text-sm text-primary-800">
              <div>Total Vendors: {heatMapData.filter(v => !v.isLandmark).length}</div>
              {heatMapData.length > 0 && (
                <>
                  <div>Peak Traffic: {Math.max(...heatMapData.map(v => Math.round(v.traffic * (timeMultipliers[selectedHour] || 0.5))))}%</div>
                  <div>Avg Traffic: {Math.round(heatMapData.reduce((acc, v) => acc + v.traffic * (timeMultipliers[selectedHour] || 0.5), 0) / heatMapData.length)}%</div>
                </>
              )}
              {lastUpdated && (
                <div className="text-xs text-primary-600 mt-2">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Heat Map Canvas */}
        <div className="lg:w-3/4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef}
              width={marketLayout?.dimensions?.width || defaultDimensions.width}
              height={marketLayout?.dimensions?.height || defaultDimensions.height}
              onClick={handleCanvasClick}
              className="cursor-pointer hover:cursor-pointer"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Click on vendor booths to see detailed information. Drag the time slider to see traffic patterns throughout the day.
            {heatMapData.length === 0 && ' No traffic data available for the selected time range.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmersMarketHeatMap;
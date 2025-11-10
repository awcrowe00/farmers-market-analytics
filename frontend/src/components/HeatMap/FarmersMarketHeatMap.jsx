import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, TrendingUp, Calendar, RefreshCw, AlertCircle, Map } from 'lucide-react';
import heatMapService from '../../services/heatMapService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const FarmersMarketHeatMap = () => {
  const canvasRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'white' }}>
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ color: '#4b5563' }}>Please log in to view the heat map.</p>
        </div>
      </div>
    );
  }

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
    // Draw grass/ground base
    const grassGradient = ctx.createLinearGradient(0, 0, 0, height);
    grassGradient.addColorStop(0, '#e8f5e9');
    grassGradient.addColorStop(0.5, '#c8e6c9');
    grassGradient.addColorStop(1, '#a5d6a7');
    ctx.fillStyle = grassGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw subtle terrain contours
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.15)';
    ctx.lineWidth = 2;
    
    // Horizontal contour lines
    for (let y = 50; y < height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      for (let x = 0; x < width; x += 20) {
        const wave = Math.sin(x / 50) * 10;
        ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    // Draw pathways/walkways
    ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
    
    // Main horizontal paths
    ctx.fillRect(50, 140, width - 100, 30);
    ctx.fillRect(50, 240, width - 100, 30);
    ctx.fillRect(50, 340, width - 100, 30);
    
    // Vertical paths
    ctx.fillRect(140, 50, 25, height - 100);
    ctx.fillRect(340, 50, 25, height - 100);
    ctx.fillRect(540, 50, 25, height - 100);

    // Add path texture (dirt/gravel effect)
    ctx.fillStyle = 'rgba(101, 67, 33, 0.1)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Only draw on paths
      const onHorizontalPath = (y > 140 && y < 170) || (y > 240 && y < 270) || (y > 340 && y < 370);
      const onVerticalPath = (x > 140 && x < 165) || (x > 340 && x < 365) || (x > 540 && x < 565);
      
      if (onHorizontalPath || onVerticalPath) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // Draw trees/decorative elements around the market
    const drawTree = (x, y, size) => {
      // Tree trunk
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(x - size/6, y, size/3, size);
      
      // Tree foliage
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Highlight
      ctx.fillStyle = 'rgba(129, 199, 132, 0.6)';
      ctx.beginPath();
      ctx.arc(x - size/4, y - size/4, size * 0.4, 0, 2 * Math.PI);
      ctx.fill();
    };

    // Place trees around the perimeter
    const treePositions = [
      { x: 40, y: 60 }, { x: 760, y: 60 },
      { x: 40, y: 180 }, { x: 760, y: 180 },
      { x: 40, y: 300 }, { x: 760, y: 300 },
      { x: 40, y: 420 }, { x: 760, y: 420 },
      { x: 150, y: 30 }, { x: 400, y: 30 }, { x: 650, y: 30 },
      { x: 150, y: 470 }, { x: 400, y: 470 }, { x: 650, y: 470 }
    ];

    treePositions.forEach(pos => {
      drawTree(pos.x, pos.y, 15);
    });

    // Draw market entrance sign
    ctx.fillStyle = 'rgba(121, 85, 72, 0.8)';
    ctx.fillRect(width/2 - 60, 10, 120, 25);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MARKET ENTRANCE', width/2, 27);

    // Draw parking area indicator
    ctx.strokeStyle = isDark ? 'rgba(200, 200, 200, 0.5)' : 'rgba(158, 158, 158, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(620, 380, 150, 100);
    ctx.setLineDash([]);
    
    ctx.fillStyle = isDark ? 'rgba(97, 97, 97, 0.6)' : 'rgba(97, 97, 97, 0.3)';
    ctx.fillRect(620, 380, 150, 100);
    
    ctx.fillStyle = isDark ? '#f3f4f6' : '#616161';
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
    
    // Draw topographical background
    if (showTopography) {
      drawTopography(ctx, width, height);
    } else {
      ctx.fillStyle = '#ffffff'; // Always white background, regardless of theme
      ctx.fillRect(0, 0, width, height);
      
      // Simple grid
      ctx.strokeStyle = isDark ? '#4b5563' : '#e9ecef';
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
    
    // Draw heat zones
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
    
    // Draw vendor booths
    heatMapData.forEach(vendor => {
      if (!vendor.location) return;
      
      const isHovered = hoveredVendor === vendor.id || hoveredVendor === vendor._id;
      const boothSize = 15;
      
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
      
      // Booth shadow
      if (showTopography) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(
          vendor.location.x - boothSize/2 + 2, 
          vendor.location.y - boothSize/2 + 2, 
          boothSize, 
          boothSize
        );
      }
      
      // Booth background
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
      
      // Booth number
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        vendor.boothNumber || vendor.name.substring(0, 3).toUpperCase(), 
        vendor.location.x, 
        vendor.location.y + 2
      );
    });
    
    // Draw landmarks
    if (marketLayout.landmarks && showTopography) {
      marketLayout.landmarks.forEach(landmark => {
        // Landmark shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(landmark.x - 8, landmark.y - 8, 20, 20);
        
        // Landmark
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(landmark.x - 10, landmark.y - 10, 20, 20);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 1;
        ctx.strokeRect(landmark.x - 10, landmark.y - 10, 20, 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(landmark.name.charAt(0), landmark.x, landmark.y + 3);
      });
    }
    
    // Draw legend
    drawLegend(ctx);
    
  }, [selectedHour, hoveredVendor, heatMapData, marketLayout, showTopography, isDark]);

  const drawLegend = (ctx) => {
    const legendX = 20;
    const legendY = 400;
    
    ctx.fillStyle = isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(legendX, legendY, 200, 80);
    ctx.strokeStyle = isDark ? '#4b5563' : '#dee2e6';
    ctx.lineWidth = 2;
    ctx.strokeRect(legendX, legendY, 200, 80);
    
    ctx.fillStyle = isDark ? '#f3f4f6' : '#212529';
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
      ctx.fillStyle = isDark ? '#f3f4f6' : '#212529';
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

  if (loading && !heatMapData.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'white' }}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-4 text-gray-600" style={{ color: '#4b5563' }}>Loading heat map data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-white' : 'bg-white'} p-6 rounded-lg shadow-lg`} style={{ backgroundColor: 'white', color: isDark ? '#f3f4f6' : '#1f2937' }}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center text-gray-900" style={{ color: '#111827' }}>
                <MapPin className="w-5 h-5 mr-2" style={{ color: '#16a34a' }} />
                Market Heat Map
              </h3>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                style={{ color: '#6b7280' }}
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {error && (
              <div className={`${isDark ? 'bg-yellow-900' : 'bg-yellow-50'} border ${isDark ? 'border-yellow-700' : 'border-yellow-200'} rounded p-3 mb-4`} style={{ backgroundColor: isDark ? '#78350f' : '#fefce8', borderColor: isDark ? '#a16207' : '#fde047' }}>
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: isDark ? '#fbbf24' : '#d97706' }} />
                  <div className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`} style={{ color: isDark ? '#fde047' : '#92400e' }}>{error}</div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" style={{ color: '#374151' }}>
                  <Calendar className="w-4 h-4 inline mr-1" style={{ color: '#374151' }} />
                  Time Range
                </label>
                <select 
                  value={selectedTimeRange} 
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  style={{ backgroundColor: 'white', color: '#111827', borderColor: '#d1d5db' }}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" style={{ color: '#374151' }}>
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
                <div className="flex justify-between text-xs mt-1 text-gray-500" style={{ color: '#6b7280' }}>
                  <span>8AM</span>
                  <span>1PM</span>
                  <span>7PM</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="flex items-center text-sm font-medium text-gray-700" style={{ color: '#374151' }}>
                  <Map className="w-4 h-4 mr-2" style={{ color: '#374151' }} />
                  Topography
                </label>
                <button
                  onClick={() => setShowTopography(!showTopography)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showTopography ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  style={{ backgroundColor: showTopography ? '#16a34a' : '#e5e7eb' }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                      showTopography ? 'translate-x-6' : 'translate-x-1'
                    }`}
                    style={{ backgroundColor: 'white' }}
                  />
                </button>
              </div>
            </div>
          </div>
          
          {hoveredVendor && (
            <div className={`${isDark ? 'bg-white' : 'bg-gray-50'} p-4 rounded-lg`} style={{ backgroundColor: '#f9fafb' }}>
              <h4 className="font-semibold mb-2 text-gray-900" style={{ color: '#111827' }}>Vendor Details</h4>
              {(() => {
                const stats = getVendorStats(hoveredVendor);
                return stats ? (
                  <div className="space-y-2 text-sm text-gray-700" style={{ color: '#374151' }}>
                    <div><strong style={{ color: '#111827' }}>{stats.name}</strong></div>
                    {stats.boothNumber && <div>Booth: {stats.boothNumber}</div>}
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" style={{ color: '#374151' }} />
                      Traffic: {Math.round(stats.traffic)}%
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" style={{ color: '#374151' }} />
                      Status: <span className={`ml-1 font-medium ${
                        stats.status === 'Very Busy' ? 'text-red-600' :
                        stats.status === 'Busy' ? 'text-orange-600' :
                        stats.status === 'Moderate' ? 'text-yellow-600' : 
                        'text-green-600'
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
          
          <div className={`${isDark ? 'bg-white' : 'bg-primary-50'} p-4 rounded-lg`} style={{ backgroundColor: '#f0fdf4' }}>
            <h4 className="font-semibold mb-2 text-primary-900" style={{ color: '#14532d' }}>Current Stats</h4>
            <div className="space-y-1 text-sm text-primary-800" style={{ color: '#166534' }}>
              <div>Total Vendors: {heatMapData.filter(v => !v.isLandmark).length}</div>
              {heatMapData.length > 0 && (
                <>
                  <div>Peak Traffic: {Math.max(...heatMapData.map(v => Math.round(v.traffic * (timeMultipliers[selectedHour] || 0.5))))}%</div>
                  <div>Avg Traffic: {Math.round(heatMapData.reduce((acc, v) => acc + v.traffic * (timeMultipliers[selectedHour] || 0.5), 0) / heatMapData.length)}%</div>
                </>
              )}
              {lastUpdated && (
                <div className="text-xs mt-2 text-primary-600" style={{ color: '#16a34a' }}>
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:w-3/4">
          <div className={`border rounded-lg overflow-hidden shadow-inner ${isDark ? 'border-gray-700' : 'border-gray-200'}`} style={{ borderColor: isDark ? '#4b5563' : '#e5e7eb', backgroundColor: 'white' }}>
            <canvas 
              ref={canvasRef}
              width={marketLayout?.dimensions?.width || defaultDimensions.width}
              height={marketLayout?.dimensions?.height || defaultDimensions.height}
              onClick={handleCanvasClick}
              className="cursor-pointer hover:cursor-pointer"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <p className="text-sm mt-2 text-gray-500" style={{ color: '#6b7280' }}>
            Click on vendor booths to see detailed information. Toggle topography to see the market layout with paths, trees, and facilities.
            {heatMapData.length === 0 && ' No traffic data available for the selected time range.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmersMarketHeatMap;

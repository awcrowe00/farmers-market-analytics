// frontend/src/components/Dashboard/StatsCard.js
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow dark:bg-primary-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-primary-200">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="p-3 bg-primary-50 rounded-full dark:bg-primary-700">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-200" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trendUp ? (
            <TrendingUp className="w-4 h-4 text-primary-600 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-secondary-600 mr-1" />
          )}
          <span className={`text-sm font-medium ${trendUp ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-400'}`}>
            {trend}
          </span>
          <span className="text-sm text-gray-500 ml-1 dark:text-primary-300">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
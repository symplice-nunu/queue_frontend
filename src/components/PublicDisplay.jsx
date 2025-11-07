import React, { useState, useEffect } from 'react';
import { queueAPI } from '../services/api';

function PublicDisplay() {
  const [displayData, setDisplayData] = useState({
    current_number: null,
    next_numbers: [],
    waiting_count: 0,
    updated_at: null,
  });

  useEffect(() => {
    fetchDisplay();
    const interval = setInterval(fetchDisplay, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDisplay = async () => {
    try {
      const response = await queueAPI.getDisplay();
      setDisplayData(response.data);
    } catch (error) {
      console.error('Error fetching display data:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500';
      case 'urgent': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
            Queue Status
          </h1>
          <p className="text-xl text-gray-600">Please wait for your number to be called</p>
        </div>

        {/* Current Number */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8 text-center">
          <div className="text-sm md:text-lg text-gray-600 mb-4 uppercase tracking-wide">
            Currently Serving
          </div>
          <div className="text-8xl md:text-9xl font-bold text-indigo-600 mb-4">
            {displayData.current_number || '---'}
          </div>
          <div className="text-lg text-gray-500">
            {displayData.waiting_count} {displayData.waiting_count === 1 ? 'person' : 'people'} waiting
          </div>
        </div>

        {/* Next Numbers */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Next Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {displayData.next_numbers.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                No patients waiting
              </div>
            ) : (
              displayData.next_numbers.map((item, index) => (
                <div
                  key={index}
                  className={`${getPriorityColor(item.priority)} rounded-lg p-4 text-center shadow-lg transform transition-transform hover:scale-105`}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {item.number}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          Last updated: {displayData.updated_at
            ? new Date(displayData.updated_at).toLocaleTimeString()
            : '—'}
        </div>
      </div>
    </div>
  );
}

export default PublicDisplay;


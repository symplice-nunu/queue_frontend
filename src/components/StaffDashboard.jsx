import React, { useState, useEffect } from 'react';
import { queueAPI } from '../services/api';

function StaffDashboard() {
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState({
    waiting_count: 0,
    in_consultation: 0,
    completed_today: 0,
    current_number: null,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    complaint: '',
    priority: 'normal',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await queueAPI.getCurrent();
      setQueue(response.data.queue || []);
      setStats({
        waiting_count: response.data.waiting_count || 0,
        in_consultation: response.data.in_consultation || 0,
        completed_today: response.data.completed_today || 0,
        current_number: response.data.current_number,
      });
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await queueAPI.addPatient(formData);
      setFormData({
        name: '',
        age: '',
        phone: '',
        complaint: '',
        priority: 'normal',
      });
      setShowAddForm(false);
      fetchQueue();
    } catch (error) {
      alert('Error adding patient: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCall = async (id) => {
    try {
      await queueAPI.callPatient(id);
      fetchQueue();
    } catch (error) {
      alert('Error calling patient: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleComplete = async (id) => {
    try {
      await queueAPI.completePatient(id);
      fetchQueue();
    } catch (error) {
      alert('Error completing patient: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePriorityChange = async (id, priority) => {
    try {
      await queueAPI.updatePriority(id, priority);
      fetchQueue();
    } catch (error) {
      alert('Error updating priority: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this patient from queue?')) return;
    try {
      await queueAPI.removePatient(id);
      fetchQueue();
    } catch (error) {
      alert('Error removing patient: ' + (error.response?.data?.message || error.message));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 border-red-500 text-red-800';
      case 'urgent': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-green-100 border-green-500 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Queue Management Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Waiting</div>
            <div className="text-2xl font-bold text-blue-600">{stats.waiting_count}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">In Consultation</div>
            <div className="text-2xl font-bold text-purple-600">{stats.in_consultation}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Completed Today</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed_today}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Current Number</div>
            <div className="text-2xl font-bold text-indigo-600">{stats.current_number || '---'}</div>
          </div>
        </div>

        {/* Add Patient Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
          >
            {showAddForm ? 'Cancel' : '+ Add Patient to Queue'}
          </button>
        </div>

        {/* Add Patient Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
            <form onSubmit={handleAddPatient}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complaint</label>
                  <textarea
                    value={formData.complaint}
                    onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="2"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add to Queue'}
              </button>
            </form>
          </div>
        )}

        {/* Queue List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Current Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Queue #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {queue.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No patients in queue
                    </td>
                  </tr>
                ) : (
                  queue.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-gray-900">#{entry.queue_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{entry.patient_name}</div>
                        {entry.patient_age && (
                          <div className="text-sm text-gray-500">Age: {entry.patient_age}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {entry.complaint || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={entry.priority}
                          onChange={(e) => handlePriorityChange(entry.id, e.target.value)}
                          className={`border rounded px-2 py-1 text-xs font-semibold ${getPriorityColor(entry.priority)}`}
                        >
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgent</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          entry.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                          entry.status === 'in_consultation' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {entry.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {entry.status === 'waiting' && (
                            <button
                              onClick={() => handleCall(entry.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded"
                            >
                              Call
                            </button>
                          )}
                          {entry.status === 'in_consultation' && (
                            <button
                              onClick={() => handleComplete(entry.id)}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-3 rounded"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(entry.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1 px-3 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;


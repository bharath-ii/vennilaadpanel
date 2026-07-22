import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Lock, Plus, X, Shield, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'https://vennila-accessoriesbckend.onrender.com/api/users'; // Using remote base for demonstration. Might need to be updated.

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/technicians`);
      setTechnicians(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg({ type: '', text: '' });
    try {
      await axios.post(`${API_BASE}/technicians`, formData);
      setFormMsg({ type: 'success', text: 'Technician added successfully!' });
      setFormData({ name: '', email: '', password: '' });
      fetchTechnicians();
      setTimeout(() => setShowForm(false), 2000);
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add technician' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 h-full bg-gray-100 flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Technicians</h2>
          <p className="text-gray-500 font-medium">Manage technician accounts and access.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchTechnicians}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-xs font-bold uppercase tracking-wide shadow-sm hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00b894] text-white text-xs font-bold uppercase tracking-wide shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
          >
            <Plus size={16} />
            Add Technician
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw size={32} className="text-[#00b894] animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-wide text-sm">Loading Technicians...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <AlertCircle size={48} className="text-red-400" />
            <p className="text-red-500 font-bold text-lg">Failed to load data</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : technicians.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
            <Shield size={64} className="text-gray-200" />
            <h3 className="text-2xl font-black text-gray-400 uppercase mt-4">No Technicians Found</h3>
            <p className="text-gray-500">Click the "Add Technician" button to create one.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-5 text-xs font-bold uppercase tracking-wider">Name</th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider">Email</th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider">Role</th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider">Added On</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((tech, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={tech.id || idx}
                  className="border-b border-gray-100 hover:bg-orange-50 transition-colors"
                >
                  <td className="p-5 font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#00b894]/10 flex items-center justify-center text-[#00b894]">
                      <Shield size={18} />
                    </div>
                    {tech.name}
                  </td>
                  <td className="p-5 text-gray-600 font-medium">{tech.email}</td>
                  <td className="p-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-emerald-100 text-emerald-700">
                      TECHNICIAN
                    </span>
                  </td>
                  <td className="p-5 text-gray-500 text-sm">
                    {tech.createdAt ? new Date(tech.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <UserPlus className="text-[#00b894]" size={24} />
                  Add Technician
                </h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                {formMsg.text && (
                  <div className={`p-4 mb-6 text-sm font-bold flex items-center gap-3 ${formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {formMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {formMsg.text}
                  </div>
                )}

                <form onSubmit={handleAddTechnician} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <UserPlus size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#00b894] focus:bg-white outline-none transition-colors font-medium text-gray-900"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#00b894] focus:bg-white outline-none transition-colors font-medium text-gray-900"
                        placeholder="technician@vennila.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#00b894] focus:bg-white outline-none transition-colors font-medium text-gray-900"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 mt-6 bg-black text-white font-black uppercase tracking-widest hover:bg-[#00b894] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {submitting ? <RefreshCw className="animate-spin" size={20} /> : 'Create Account'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Technicians;

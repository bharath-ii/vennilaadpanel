import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RefreshCw, CheckCircle, Clock, Trash2, Eye, X, Phone, User, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/products\/?$/, '') : 'https://vennial-backend.vercel.app/api';
const API_URL = `${BASE_URL}/enquiries`;

const EnquiriesManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, RESOLVED
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setEnquiries(res.data);
    } catch (err) {
      console.error("Fetch enquiries error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'RESOLVED' ? 'PENDING' : 'RESOLVED';
    setActionLoading(id);
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      setEnquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this model enquiry?")) return;
    setActionLoading(id);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEnquiries(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Delete enquiry error:", err);
      alert("Failed to delete enquiry.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredEnquiries = enquiries.filter(item => {
    const matchesSearch = 
      (item.modelName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.itemNeeded || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.userPhone || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'PENDING') return matchesSearch && item.status !== 'RESOLVED';
    if (filterStatus === 'RESOLVED') return matchesSearch && item.status === 'RESOLVED';
    return matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-[#f3f4f6] p-4 md:p-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-2 border-gray-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#00b894] w-2 h-8 block"></span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-tighter">Model Enquiries</h2>
            <span className="bg-[#00b894] text-white text-xs font-bold px-2.5 py-1 rounded-full ml-2">
              {enquiries.length}
            </span>
          </div>
          <p className="text-gray-500 font-medium ml-4 text-sm">Customer item requests and model enquiries</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={fetchEnquiries}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 font-bold text-xs uppercase hover:bg-gray-50 sharp-edges transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#00b894]" : "text-gray-500"} />
            Refresh
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search model, item, customer name/phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894] outline-none text-sm font-semibold sharp-edges"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'PENDING', 'RESOLVED'].map(st => {
            const isSelected = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 text-xs font-black uppercase sharp-edges transition-all ${
                  isSelected 
                    ? 'bg-[#00b894] text-white shadow' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500 font-bold">
            <RefreshCw className="animate-spin mr-2 text-[#00b894]" /> Loading enquiries...
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="bg-white p-12 text-center rounded border border-gray-200 shadow-sm my-4">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No Enquiries Found</h3>
            <p className="text-sm text-gray-400 mt-1">There are no customer model enquiries matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEnquiries.map(item => {
              const isResolved = item.status === 'RESOLVED';
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white border-2 p-5 rounded-lg shadow-sm flex flex-col justify-between transition-all ${
                    isResolved ? 'border-gray-200 bg-gray-50/50' : 'border-[#00b894]/40 hover:border-[#00b894]'
                  }`}
                >
                  <div>
                    {/* Top Row: Category & Status */}
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-emerald-50 text-[#00b894] border border-[#00b894]/20 text-[11px] font-black uppercase px-2.5 py-1 rounded">
                        {item.itemNeeded}
                      </span>
                      
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded flex items-center gap-1 ${
                        isResolved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isResolved ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {isResolved ? 'RESOLVED' : 'PENDING'}
                      </span>
                    </div>

                    {/* Model Name */}
                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                      {item.modelName}
                    </h3>

                    {/* Additional Notes */}
                    {item.description ? (
                      <p className="text-xs text-gray-600 mb-4 bg-gray-50 p-2.5 rounded border border-gray-100 italic">
                        "{item.description}"
                      </p>
                    ) : null}

                    {/* Photo Thumbnail if present */}
                    {item.photo ? (
                      <div className="mb-4">
                        <button
                          onClick={() => setSelectedPhoto(item.photo)}
                          className="flex items-center gap-2 text-xs font-bold text-[#00b894] hover:underline bg-emerald-50 p-2 rounded w-full border border-emerald-100"
                        >
                          <ImageIcon size={14} />
                          <span>View Photo Attachment</span>
                          <Eye size={14} className="ml-auto" />
                        </button>
                      </div>
                    ) : null}

                    {/* Customer Info */}
                    <div className="border-t border-gray-100 pt-3 mt-2 space-y-1 text-xs font-medium text-gray-500">
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-gray-400" />
                        <span className="font-bold text-gray-700">{item.userName || 'Customer'}</span>
                      </div>
                      {item.userPhone ? (
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-gray-400" />
                          <a href={`tel:${item.userPhone}`} className="text-blue-600 font-bold hover:underline">
                            {item.userPhone}
                          </a>
                        </div>
                      ) : null}
                      <div className="text-[10px] text-gray-400 mt-1">
                        Submitted: {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 gap-2">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      disabled={actionLoading === item.id}
                      className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-colors ${
                        isResolved 
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                          : 'bg-[#00b894] text-white hover:bg-[#00a383]'
                      }`}
                    >
                      {actionLoading === item.id ? 'Updating...' : (isResolved ? 'Mark Pending' : 'Mark Resolved')}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={actionLoading === item.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Enquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* PHOTO PREVIEW LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div 
              className="relative bg-white rounded-lg p-2 max-w-3xl max-h-[85vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors z-10"
              >
                <X size={20} />
              </button>
              <img
                src={selectedPhoto}
                alt="Enquiry attachment"
                className="max-h-[75vh] w-auto object-contain mx-auto rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EnquiriesManager;

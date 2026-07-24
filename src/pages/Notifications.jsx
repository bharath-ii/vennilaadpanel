import React, { useState, useEffect } from "react";
import { Bell, Trash2, Plus, Send, Heart, Clock, Loader } from "lucide-react";

const BACKEND = "https://vennial-backend.vercel.app/api";

const ICON_OPTIONS = [
  { value: "bell", label: "Bell" },
  { value: "party-popper", label: "Party" },
  { value: "new-box", label: "New Feature" },
  { value: "sale", label: "Sale" },
  { value: "tools", label: "Update" },
  { value: "information", label: "Info" },
  { value: "trophy", label: "Achievement" },
  { value: "alert-circle", label: "Alert" },
];

const COLOR_OPTIONS = [
  { value: "#00b894", label: "Green" },
  { value: "#6c5ce7", label: "Purple" },
  { value: "#e17055", label: "Orange" },
  { value: "#fdcb6e", label: "Yellow" },
  { value: "#0984e3", label: "Blue" },
  { value: "#d63031", label: "Red" },
  { value: "#00cec9", label: "Teal" },
  { value: "#e84393", label: "Pink" },
];

function formatTime(createdAt) {
  if (!createdAt) return "";
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return diffMin + "m ago";
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + "h ago";
  return Math.floor(diffHr / 24) + "d ago";
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("bell");
  const [color, setColor] = useState("#00b894");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(BACKEND + "/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (e) {
      setError("Failed to load notifications.");
    }
    setLoading(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) { setError("Title and message are required."); return; }
    setPosting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(BACKEND + "/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, icon, color }),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => [data.notification, ...prev]);
        setTitle("");
        setMessage("");
        setIcon("bell");
        setColor("#00b894");
        setSuccess("Notification posted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to post.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    }
    setPosting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notification?")) return;
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await fetch(BACKEND + "/notifications/" + id, { method: "DELETE" });
    } catch (e) {}
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-[#00b894] rounded-xl flex items-center justify-center">
            <Bell size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">Post messages to all app users</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-[#00b894]" /> New Notification
          </h2>
          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. New Feature Alert"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]"
                maxLength={80}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Message *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894] resize-none"
                maxLength={500}
              />
              <p className="text-right text-xs text-gray-400 mt-1">{message.length}/500</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Icon</label>
                <select
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]"
                >
                  {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Color</label>
                <select
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]"
                >
                  {COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            {/* Color Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "25" }}>
                <Bell size={20} style={{ color: color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title || "Title Preview"}</p>
                <p className="text-xs text-gray-500">{message.slice(0, 50) || "Message preview..."}</p>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}
            {success && <p className="text-green-600 text-sm bg-green-50 rounded-xl px-4 py-2">{success}</p>}
            <button
              type="submit"
              disabled={posting}
              className="w-full bg-[#00b894] text-white font-bold py-3 rounded-xl hover:bg-[#00a381] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {posting ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              {posting ? "Posting..." : "Post Notification"}
            </button>
          </form>
        </div>

        {/* Posted Notifications List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-[#00b894]" /> Posted ({notifications.length})
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader size={28} className="animate-spin text-[#00b894]" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Bell size={40} strokeWidth={1} />
              <p className="mt-3 text-sm">No notifications posted yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition group">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: (n.color || "#00b894") + "20" }}>
                    <Bell size={18} style={{ color: n.color || "#00b894" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={11} /> {formatTime(n.createdAt)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <Heart size={11} fill="currentColor" /> {n.likeCount || 0}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

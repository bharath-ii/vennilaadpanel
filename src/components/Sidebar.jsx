import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Battery, Layers, Monitor, Cpu, User, Grid, Box, Wrench, Users } from 'lucide-react';

const menuItems = [
  { name: 'Temper', path: '/temper', icon: Monitor },
  { name: 'Combo Folder', path: '/combo', icon: Layers },
  { name: 'Frame', path: '/frame', icon: Grid },
  { name: 'Battery', path: '/battery', icon: Battery },
  { name: 'CC Board', path: '/cc-board', icon: Cpu },
  { name: 'On Off Volume Strip', path: '/on-off-volume', icon: Smartphone },
  { name: 'Back Case', path: '/back-case', icon: Smartphone },
  { name: 'PC Build', path: '/pc-build', icon: Box },
  { name: 'Mobile Services', path: '/mobile-services', icon: Wrench },
  { name: 'Technicians', path: '/technicians', icon: Users },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white h-full flex flex-col border-r border-gray-200 z-10 shadow-lg">
      
      {/* Brand Header */}
      <div className="h-24 flex items-center justify-center border-b border-gray-100 bg-white">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-xl font-black text-[#00b894] uppercase tracking-tighter leading-none">VENNILA ACCESSORIES</h1>
          <span className="text-[10px] font-bold text-gray-400 tracking-[0.4em] uppercase block">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="block relative group">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00b894]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`
                flex items-center px-6 py-4 transition-all duration-200
                ${isActive ? 'bg-orange-50/50 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`${isActive ? 'text-[#00b894]' : 'text-gray-400'} mr-4`} />
                <span className={`text-sm font-bold uppercase tracking-wide ${isActive ? 'translate-x-1' : ''} transition-transform`}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-lg">
            E
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 uppercase truncate">Exceptionz</p>
            <p className="text-[10px] text-gray-500 truncate">exceptionzofficial@gamil.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
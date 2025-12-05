import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Image as ImageIcon, 
  Wand2, 
  Table2, 
  Ruler, 
  Menu, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { NavItem } from '../types';

const navigation: NavItem[] = [
  { name: 'Image to PDF', path: '/image-to-pdf', icon: <ImageIcon className="w-5 h-5" />, description: 'Convert images to a single PDF' },
  { name: 'AI Text Polish', path: '/ai-text', icon: <Wand2 className="w-5 h-5" />, description: 'Rewrite and improve text with Gemini' },
  { name: 'JSON <> CSV', path: '/json-csv', icon: <Table2 className="w-5 h-5" />, description: 'Convert between data formats' },
  { name: 'Unit Converter', path: '/units', icon: <Ruler className="w-5 h-5" />, description: 'Length, Weight, and Temperature' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const activeTool = navigation.find(n => n.path === location.pathname);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <span className="font-bold text-xl text-slate-800">OmniConvert</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <Menu className="w-5 h-5" />
            Dashboard
          </NavLink>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tools
          </div>

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <span className={`transition-colors ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {item.icon}
              </span>
              <div className="flex-1">
                {item.name}
              </div>
              {location.pathname === item.path && (
                 <ChevronRight className="w-4 h-4 text-indigo-400" />
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between lg:justify-end">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          {activeTool && (
            <div className="lg:hidden font-medium text-slate-800">
              {activeTool.name}
            </div>
          )}

          <div className="flex items-center gap-4">
             {/* Header Actions placeholder */}
             <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
               v1.0.0
             </a>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
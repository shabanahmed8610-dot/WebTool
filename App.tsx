import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import ImageToPdf from './components/tools/ImageToPdf';
import AiTextConverter from './components/tools/AiTextConverter';
import JsonCsv from './components/tools/JsonCsv';
import UnitConverter from './components/tools/UnitConverter';
import { ArrowRight, Image as ImageIcon, Wand2, Table2, Ruler } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center py-10 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Tools for <span className="text-indigo-600">Digital Craftsmen</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          OmniConvert brings together essential developer and daily utility tools in one seamless, ad-free interface.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/image-to-pdf" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Image to PDF</h3>
          <p className="text-slate-500 mb-4">Combine multiple images into a single, high-quality PDF document instantly.</p>
          <div className="flex items-center text-sm font-semibold text-indigo-600">
            Start Converting <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link to="/ai-text" className="group bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl border border-transparent shadow-lg text-white transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
            <Wand2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">AI Text Polish</h3>
          <p className="text-indigo-100 mb-4">Use Gemini AI to rewrite, summarize, or fix grammar in your text.</p>
          <div className="flex items-center text-sm font-semibold text-white">
            Try AI Magic <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link to="/json-csv" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
            <Table2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">JSON & CSV</h3>
          <p className="text-slate-500 mb-4">Transform data formats back and forth for easy database import/export.</p>
          <div className="flex items-center text-sm font-semibold text-green-600">
            Transform Data <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        <Link to="/units" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
            <Ruler className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Unit Converter</h3>
          <p className="text-slate-500 mb-4">Simple yet powerful converter for length, weight, and temperature.</p>
          <div className="flex items-center text-sm font-semibold text-orange-600">
            Calculate <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/ai-text" element={<AiTextConverter />} />
          <Route path="/json-csv" element={<JsonCsv />} />
          <Route path="/units" element={<UnitConverter />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
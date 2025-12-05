import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, AlertCircle, FileJson, FileSpreadsheet } from 'lucide-react';

const JsonCsv: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [csvInput, setCsvInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastActive, setLastActive] = useState<'json' | 'csv'>('json');

  const jsonToCsv = (json: string) => {
    try {
      const data = JSON.parse(json);
      const array = Array.isArray(data) ? data : [data];
      
      if (array.length === 0) return '';
      
      const headers = Object.keys(array[0]);
      const csvRows = [headers.join(',')];
      
      for (const row of array) {
        const values = headers.map(header => {
          const escaped = ('' + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }
      return csvRows.join('\n');
    } catch (e) {
      throw new Error("Invalid JSON format");
    }
  };

  const csvToJson = (csv: string) => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return '[]';
    
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      // This is a naive CSV splitter, doesn't handle commas inside quotes well without regex
      // Using a regex for better CSV parsing
      const currentline = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      
      headers.forEach((header, index) => {
        let val = currentline[index] || "";
        // Remove quotes if present
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        obj[header] = val;
      });
      result.push(obj);
    }
    return JSON.stringify(result, null, 2);
  };

  const handleConvert = () => {
    setError(null);
    try {
      if (lastActive === 'json') {
        const result = jsonToCsv(jsonInput);
        setCsvInput(result);
      } else {
        const result = csvToJson(csvInput);
        setJsonInput(result);
      }
    } catch (e: any) {
      setError(e.message || "Conversion failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">JSON <> CSV Converter</h2>
           <p className="text-slate-500">Transform data structures instantly for Excel or Web APIs.</p>
        </div>
        <button 
          onClick={handleConvert}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <ArrowLeftRight className="w-5 h-5" />
          Convert {lastActive === 'json' ? 'to CSV' : 'to JSON'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* JSON Side */}
        <div 
          className={`flex flex-col h-full rounded-2xl border-2 transition-colors overflow-hidden ${lastActive === 'json' ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-200'}`}
          onClick={() => setLastActive('json')}
        >
          <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center">
             <div className="flex items-center gap-2 text-slate-700 font-semibold">
               <FileJson className="w-5 h-5 text-indigo-500" />
               JSON
             </div>
             <button 
               onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(jsonInput); }} 
               className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors"
               title="Copy JSON"
             >
               <Copy className="w-4 h-4" />
             </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="flex-1 p-4 resize-none outline-none font-mono text-sm bg-white"
            placeholder='[{"name": "John", "age": 30}]'
          />
        </div>

        {/* CSV Side */}
        <div 
          className={`flex flex-col h-full rounded-2xl border-2 transition-colors overflow-hidden ${lastActive === 'csv' ? 'border-green-500 ring-4 ring-green-50' : 'border-slate-200'}`}
          onClick={() => setLastActive('csv')}
        >
          <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center">
             <div className="flex items-center gap-2 text-slate-700 font-semibold">
               <FileSpreadsheet className="w-5 h-5 text-green-600" />
               CSV
             </div>
             <button 
               onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(csvInput); }} 
               className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors"
               title="Copy CSV"
             >
               <Copy className="w-4 h-4" />
             </button>
          </div>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="flex-1 p-4 resize-none outline-none font-mono text-sm bg-white"
            placeholder='name,age&#10;"John",30'
          />
        </div>
      </div>
    </div>
  );
};

export default JsonCsv;
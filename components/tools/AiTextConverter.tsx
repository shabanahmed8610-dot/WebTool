import React, { useState } from 'react';
import { Wand2, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { polishText, summarizeText } from '../../services/geminiService';
import { AiTone } from '../../types';

const AiTextConverter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<AiTone>(AiTone.PROFESSIONAL);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'polish' | 'summarize'>('polish');

  const handleConvert = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setOutputText(''); // Clear previous output
    try {
      let result = '';
      if (mode === 'polish') {
        result = await polishText(inputText, selectedTone);
      } else {
        result = await summarizeText(inputText);
      }
      setOutputText(result);
    } catch (error) {
      setOutputText('An error occurred while processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            AI Text Assistant
          </h2>
          <p className="text-indigo-100 max-w-xl">
            Leverage the power of Gemini to rewrite, polish, or summarize your text instantly. 
            Perfect for emails, essays, and quick formatting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Input Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">Input Text</label>
            <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
              <button
                onClick={() => setMode('polish')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${mode === 'polish' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Polish
              </button>
              <button
                onClick={() => setMode('summarize')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${mode === 'summarize' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Summarize
              </button>
            </div>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="flex-1 w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-sm transition-all"
          />

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             {mode === 'polish' && (
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as AiTone)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none"
              >
                {Object.values(AiTone).map((tone) => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
             )}
             
             <button
              onClick={handleConvert}
              disabled={isLoading || !inputText.trim()}
              className={`flex-1 py-2.5 px-6 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all
                ${isLoading || !inputText.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:-translate-y-0.5'
                }
              `}
             >
               {isLoading ? (
                 <>
                   <RefreshCw className="w-5 h-5 animate-spin" />
                   Processing...
                 </>
               ) : (
                 <>
                   <Wand2 className="w-5 h-5" />
                   {mode === 'polish' ? 'Rewrite Text' : 'Summarize'}
                 </>
               )}
             </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">AI Output</label>
            {outputText && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="flex-1 w-full p-6 rounded-xl border border-slate-200 bg-slate-50/50 relative group overflow-auto">
            {outputText ? (
              <p className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                {outputText}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Sparkles className="w-12 h-12 mb-4 text-slate-300" />
                <p>AI generated content will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTextConverter;
import React, { useState, useEffect } from 'react';
import { Ruler, Scale, Thermometer } from 'lucide-react';

type UnitType = 'length' | 'weight' | 'temperature';

interface Unit {
  value: string;
  label: string;
  rate: number; // Multiplier to base unit
  offset?: number; // For temp
}

const UNITS: Record<UnitType, Unit[]> = {
  length: [
    { value: 'm', label: 'Meters', rate: 1 },
    { value: 'km', label: 'Kilometers', rate: 0.001 },
    { value: 'cm', label: 'Centimeters', rate: 100 },
    { value: 'mm', label: 'Millimeters', rate: 1000 },
    { value: 'ft', label: 'Feet', rate: 3.28084 },
    { value: 'in', label: 'Inches', rate: 39.3701 },
  ],
  weight: [
    { value: 'kg', label: 'Kilograms', rate: 1 },
    { value: 'g', label: 'Grams', rate: 1000 },
    { value: 'lb', label: 'Pounds', rate: 2.20462 },
    { value: 'oz', label: 'Ounces', rate: 35.274 },
  ],
  temperature: [
    { value: 'c', label: 'Celsius', rate: 1, offset: 0 },
    { value: 'f', label: 'Fahrenheit', rate: 1, offset: 0 }, // Handled specially
    { value: 'k', label: 'Kelvin', rate: 1, offset: 0 },    // Handled specially
  ]
};

const UnitConverter: React.FC = () => {
  const [activeType, setActiveType] = useState<UnitType>('length');
  const [amount, setAmount] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [result, setResult] = useState<string>('');

  // Initialize defaults when type changes
  useEffect(() => {
    setFromUnit(UNITS[activeType][0].value);
    setToUnit(UNITS[activeType][1]?.value || UNITS[activeType][0].value);
  }, [activeType]);

  // Calculate
  useEffect(() => {
    if (activeType === 'temperature') {
      let val = amount;
      // Convert to Celsius first
      if (fromUnit === 'f') val = (amount - 32) * 5/9;
      if (fromUnit === 'k') val = amount - 273.15;
      
      // Convert from Celsius to target
      let final = val;
      if (toUnit === 'f') final = (val * 9/5) + 32;
      if (toUnit === 'k') final = val + 273.15;
      
      setResult(final.toFixed(2));
    } else {
      const from = UNITS[activeType].find(u => u.value === fromUnit);
      const to = UNITS[activeType].find(u => u.value === toUnit);
      
      if (from && to) {
        // Convert to base then to target
        const base = amount / from.rate;
        const final = base * to.rate;
        setResult(final.toFixed(4).replace(/\.?0+$/, ''));
      }
    }
  }, [amount, fromUnit, toUnit, activeType]);

  const tabs = [
    { id: 'length', label: 'Length', icon: <Ruler className="w-4 h-4" /> },
    { id: 'weight', label: 'Weight', icon: <Scale className="w-4 h-4" /> },
    { id: 'temperature', label: 'Temp', icon: <Thermometer className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Unit Converter</h2>
        <p className="text-slate-500">Quickly convert common measurements.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id as UnitType)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors
                ${activeType === tab.id 
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
            {/* From */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">From</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-4xl font-light text-slate-800 p-2 bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none transition-colors"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full p-2 bg-slate-50 rounded-lg text-slate-600 border border-transparent focus:border-indigo-200 focus:ring-2 focus:ring-indigo-50 outline-none"
              >
                {UNITS[activeType].map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>

            <div className="text-slate-300 flex justify-center pt-6">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">
                =
              </div>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">To</label>
              <div className="w-full text-4xl font-light text-indigo-600 p-2 border-b border-transparent">
                {result || '...'}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full p-2 bg-slate-50 rounded-lg text-slate-600 border border-transparent focus:border-indigo-200 focus:ring-2 focus:ring-indigo-50 outline-none"
              >
                {UNITS[activeType].map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
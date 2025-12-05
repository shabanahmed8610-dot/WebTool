import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileDown, Trash2, Plus, Move } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
}

const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: ImageFile[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (!file.type.startsWith('image/')) continue;

        const preview = await readFileAsDataURL(file);
        const { width, height } = await getImageDimensions(preview);
        
        newImages.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview,
          width,
          height
        });
      }

      setImages(prev => [...prev, ...newImages]);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getImageDimensions = (src: string): Promise<{width: number, height: number}> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = src;
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const generatePDF = useCallback(async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      // Default A4 size in mm
      const doc = new jsPDF();
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (i > 0) doc.addPage();

        // Calculate aspect ratio to fit the page
        const imgRatio = img.width / img.height;
        const pageRatio = pdfWidth / pdfHeight;

        let renderWidth = pdfWidth;
        let renderHeight = pdfWidth / imgRatio;

        if (renderHeight > pdfHeight) {
          renderHeight = pdfHeight;
          renderWidth = pdfHeight * imgRatio;
        }

        // Center the image
        const x = (pdfWidth - renderWidth) / 2;
        const y = (pdfHeight - renderHeight) / 2;

        doc.addImage(img.preview, 'JPEG', x, y, renderWidth, renderHeight);
      }

      doc.save('converted-images.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [images]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Image to PDF Converter</h2>
        <p className="text-slate-500">Convert your JPG, PNG, or WEBP images into a single professional PDF document.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
           <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all group min-h-[300px]"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-1">Click to upload images</h3>
            <p className="text-indigo-600/70 text-sm">SVG, PNG, JPG or GIF (max 800x400px)</p>
          </div>

          {images.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-semibold text-slate-700">Selected Images ({images.length})</h3>
                 <button 
                  onClick={() => setImages([])}
                  className="text-red-500 text-sm hover:text-red-700 font-medium flex items-center gap-1"
                 >
                   <Trash2 className="w-4 h-4" /> Clear All
                 </button>
               </div>
               <div className="divide-y divide-slate-100">
                  {images.map((img, index) => (
                    <div key={img.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                        <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{img.file.name}</p>
                        <p className="text-xs text-slate-500">{(img.file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button 
                        onClick={() => removeImage(img.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h3 className="font-semibold text-slate-800 mb-4">Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Images</span>
                <span className="font-medium text-slate-900">{images.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Est. Size</span>
                <span className="font-medium text-slate-900">
                  {(images.reduce((acc, img) => acc + img.file.size, 0) / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>

            <button
              onClick={generatePDF}
              disabled={images.length === 0 || isGenerating}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-indigo-200
                ${images.length === 0 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>

            {images.length === 0 && (
              <p className="text-center text-xs text-slate-400 mt-4">
                Upload at least one image to enable conversion.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToPdf;
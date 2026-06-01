import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AddProductForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Smartfonlar');
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categoriesList = [
    { value: 'Smartfonlar', label: 'Smartfonlar' },
    { value: 'Noutbuklar', label: 'Noutbuklar' },
    { value: 'Aksessuarlar', label: 'Aksessuarlar' },
    { value: 'Audio', label: 'Audio qurilmalar' },
    { value: 'Smart-Watch', label: 'Aqlli soatlar' }
  ];

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError('');

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Faqat rasm fayllarini yuklash mumkin (.jpg, .png, .webp)");
      return;
    }
    
    // Max size 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Rasm hajmi 5MB dan oshmasligi kerak");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validations
    if (!name.trim()) return setError("Mahsulot nomini kiriting");
    if (!description.trim()) return setError("Mahsulot tavsifini kiriting");
    if (!price || Number(price) <= 0) return setError("Mahsulot narxini to'g'ri kiriting");
    if (!stock || Number(stock) < 0) return setError("Ombor qoldig'ini kiriting");
    if (!imageFile) return setError("Mahsulot rasmini yuklang");

    setLoading(true);

    // Prepare simulated FormData payload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('image', imageFile);

    // Logging to console as requested
    console.log("Submit form data object:", {
      name,
      description,
      price,
      stock,
      category,
      imageFile: imageFile.name
    });

    try {
      // Simulate real-world Spring Boot POST API call structure
      await fetch('/api/products', {
        method: 'POST',
        body: formData,
        // Wait, for mock environment we trigger local timeout
      });

      // Simulating success
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        // Clean fields
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setImageFile(null);
        setImagePreview(null);
      }, 1000);

    } catch (err) {
      setLoading(false);
      setError("Mahsulotni qo'shishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center space-x-2 text-xs font-bold text-gray-450 hover:text-purple-650 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} className="stroke-[2.5]" />
        <span>Mahsulotlar ro'yxatiga qaytish</span>
      </button>

      {/* Title */}
      <div>
        <h1 className="font-display font-extrabold text-2xl text-gray-900 tracking-tight">
          Yangi mahsulot qo'shish
        </h1>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          Katalogni to'ldirish uchun yangi qurilma ma'lumotlarini kiriting.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-150 rounded-xl p-3.5 text-xs font-semibold text-red-650 flex items-start gap-2.5">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3.5 text-xs font-semibold text-emerald-650 flex items-start gap-2.5">
          <ShieldCheck size={15} className="shrink-0 mt-0.5" />
          <span>Mahsulot muvaffaqiyatli qo'shildi!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Basic product attributes */}
        <div className="space-y-5">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold tracking-wider text-gray-450 uppercase">
              Mahsulot nomi
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: iPhone 15 Pro Max 256GB"
              disabled={loading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-purple-600/40 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold tracking-wider text-gray-450 uppercase">
              Kategoriya
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-purple-600/40 transition-all"
            >
              {categoriesList.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Price */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold tracking-wider text-gray-450 uppercase">
                Narxi (so'm)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="17200000"
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-purple-600/40 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold tracking-wider text-gray-450 uppercase">
                Ombor qoldig'i (Soni)
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="24"
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-purple-600/40 transition-all placeholder:text-gray-400"
              />
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold tracking-wider text-gray-450 uppercase">
              Ta'rifi
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qurilma parametrlari, rang variantlari va asosiy texnik xususiyatlarini yozing..."
              disabled={loading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-purple-600/40 transition-all placeholder:text-gray-400 resize-none"
            />
          </div>

        </div>

        {/* Right Side: Image Upload & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          
          {/* File Upload drag area */}
          <div className="space-y-2 flex-grow flex flex-col">
            <label className="text-[10px] font-extrabold tracking-wider text-gray-450 uppercase block">
              Mahsulot rasmini yuklash
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-grow border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                imagePreview 
                  ? 'border-purple-200 bg-purple-50/10'
                  : isDragOver
                  ? 'border-purple-600 bg-purple-50/30'
                  : 'border-gray-200 hover:border-purple-600/50 bg-gray-50/50 hover:bg-white'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                disabled={loading}
              />

              {imagePreview ? (
                /* Selected File Preview card */
                <div className="relative group w-full h-full max-h-[190px] flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain max-h-[170px]"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedImage();
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <X size={14} className="stroke-[2.5]" />
                  </button>
                  
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white rounded px-2 py-1 text-[9px] font-mono truncate select-none">
                    {imageFile?.name} ({( (imageFile?.size || 0) / (1024 * 1024) ).toFixed(2)} MB)
                  </div>
                </div>
              ) : (
                /* Blank drag target prompt */
                <div className="space-y-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto">
                    <Upload size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-purple-650 hover:text-purple-700 block">
                      Rasm yuklash
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-1 leading-normal">
                      Faylni bu yerga sudrab keling yoki bosing <br />
                      Maksimal hajm: 5 MB
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="w-1/2 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-all font-display font-bold text-xs cursor-pointer text-center"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-3.5 rounded-xl bg-purple-600 text-white font-display font-bold hover:bg-purple-700 transition-all flex items-center justify-center space-x-2 shadow-sm shadow-purple-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              {loading ? "Qo'shilmoqda..." : "Mahsulotni qo'shish"}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}

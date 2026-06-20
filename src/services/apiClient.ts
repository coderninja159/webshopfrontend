import axios from 'axios';

// Create premium glassmorphic toast notification for global error alerts
export const showGlobalToast = (message: string, type: 'error' | 'success' | 'warning' = 'error') => {
  if (typeof document === 'undefined') return;
  
  let container = document.getElementById('shopwep-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'shopwep-toast-container';
    container.className = 'fixed top-6 right-6 z-9999 flex flex-col gap-3 max-w-sm w-full pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `
    pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-350 transform translate-x-24 opacity-0 text-left
    ${
      type === 'error' 
        ? 'bg-red-50/95 border-red-200/60 text-red-900 shadow-red-500/5' 
        : 'bg-emerald-50/95 border-emerald-200/60 text-emerald-900 shadow-emerald-500/5'
    }
  `;
  
  const icon = type === 'error' ? '⚠️' : '✨';
  const title = type === 'error' ? 'Xatolik yuz berdi' : 'Muvaffaqiyatli';
  
  toast.innerHTML = `
    <div class="text-lg shrink-0 mt-0.5">${icon}</div>
    <div class="flex-grow space-y-0.5">
      <div class="text-xs font-bold text-gray-900 leading-tight">${title}</div>
      <div class="text-[11px] text-gray-600 font-semibold leading-relaxed">${message}</div>
    </div>
    <button class="text-gray-400 hover:text-gray-700 text-xs font-bold shrink-0 ml-1 cursor-pointer transition-colors" aria-label="Yopish">✕</button>
  `;

  // Close event listener
  const closeBtn = toast.querySelector('button');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('translate-x-0', 'opacity-100');
      toast.classList.add('translate-x-24', 'opacity-0');
      setTimeout(() => toast.remove(), 350);
    });
  }

  container.appendChild(toast);

  // Trigger entering animation
  setTimeout(() => {
    toast.classList.remove('translate-x-24', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
  }, 50);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove('translate-x-0', 'opacity-100');
      toast.classList.add('translate-x-24', 'opacity-0');
      setTimeout(() => toast.remove(), 350);
    }
  }, 5000);
};

// Create a robust Axios client instance with baseline config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000, // 15 seconds wait limit before aborting
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT bearer token automatically if present
apiClient.interceptors.request.use(
  (config) => {
    // Lookup standard keys in localstorage
    const token = localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('shopwep-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch offline status and 5xx errors to protect UI thread
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Backend offline, slow networks, or abort timeouts
    if (!error.response) {
      showGlobalToast(
        "Katalog serveri bilan aloqa o'rnatib bo'lmadi. Tarmoq ulanishingizni tekshiring yoki keyinroq qayta urinib ko'ring.",
        'error'
      );
      return Promise.reject(new Error("Server offline or connection timeout"));
    }

    const { status, data } = error.response;
    const backendMessage = data?.message || data?.error || '';

    // Handle authentication or authorization issues (401 / 403)
    if (status === 401) {
      showGlobalToast("Sessiya muddati tugadi. Tizimga qayta kirishingizni so'raymiz.", 'error');
    } else if (status === 403) {
      showGlobalToast("Ushbu amalni bajarish uchun sizda yetarli huquqlar yo'q.", 'error');
    } else if (status === 429) {
      showGlobalToast("So'rovlar soni juda ko'p! Iltimos, bir oz kuting va qayta urining.", 'error');
    } else if (status >= 500) {
      showGlobalToast(
        backendMessage || "Serverda ichki xatolik yuz berdi. Tez orada muammo bartaraf etiladi.",
        'error'
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;

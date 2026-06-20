import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

import { Navbar } from './components/layout/Navbar';
import { BottomNavbar } from './components/layout/BottomNavbar';
import { Footer } from './components/layout/Footer';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { Storefront } from './pages/Storefront';

// Secure Additions
import { CustomerLogin } from './pages/CustomerLogin';
import { Register } from './pages/Register';
import { AdminSecureLogin } from './pages/AdminSecureLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AddProductForm } from './components/admin/AddProductForm';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminCustomers } from './pages/AdminCustomers';

// Wrap page changes inside framer-motion transitions
function AnimatedAppRoutes() {
  const location = useLocation();
  
  const pageTransitionVariants: Variants = {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: {
        duration: 0.25,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        
        {/* Public Storefront Routes */}
        <Route 
          path="/" 
          element={
            <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
              <LandingPage />
            </motion.div>
          } 
        />

        {/* Customer Login & Register Gates */}
        <Route 
          path="/login" 
          element={
            <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
              <CustomerLogin />
            </motion.div>
          } 
        />
        <Route 
          path="/register" 
          element={
            <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
              <Register />
            </motion.div>
          } 
        />

        {/* Protected Customer & Admin Routes */}
        <Route 
          path="/store" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <Storefront />
              </motion.div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/products" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <Products />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <ProductDetail />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <CartPage />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <Dashboard />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <CartPage />
              </motion.div>
            </ProtectedRoute>
          } 
        />

        {/* Admin Login Gate (Strictly Hidden Portal) */}
        <Route 
          path="/admin-secure-gate" 
          element={
            <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
              <AdminSecureLogin />
            </motion.div>
          } 
        />

        {/* Protected Admin Only Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <AdminDashboard />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <AdminProducts />
              </motion.div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/products/new" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <AddProductForm />
              </motion.div>
            </ProtectedRoute>
          } 
        />

        {/* Placeholders for sidebar coverage to prevent redirects */}
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <AdminDashboard />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/customers" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <motion.div variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-grow flex flex-col">
                <AdminCustomers />
              </motion.div>
            </ProtectedRoute>
          } 
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

function LayoutWrapper() {
  const location = useLocation();

  const isSecureGate = location.pathname === '/admin-secure-gate';
  const isAdminPath = location.pathname.startsWith('/admin');

  // Admin secure login page
  if (isSecureGate) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f2f4f7]">
        <main className="flex-grow flex flex-col w-full">
          <AnimatedAppRoutes />
        </main>
      </div>
    );
  }

  // Admin protected sub-panel (dashboard/products/orders) with left navigation sidebar
  if (isAdminPath) {
    return (
      <AdminLayout>
        <AnimatedAppRoutes />
      </AdminLayout>
    );
  }

  // Customer retail layout
  return (
    <div className="flex flex-col min-h-screen bg-[#f2f4f7] text-text-main transition-colors duration-300">
      
      {/* Navbar visible on Customer paths only */}
      <Navbar />
      
      {/* Core content */}
      <main className="flex-grow flex flex-col w-full">
        <AnimatedAppRoutes />
      </main>
      
      {/* Mobile nav visible on Customer paths only */}
      <BottomNavbar />
      
      {/* Footer visible on Customer paths only */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;

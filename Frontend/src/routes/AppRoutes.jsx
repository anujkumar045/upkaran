import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';

// Public Pages
import HomePage from '../pages/home/HomePage';
import MarketplacePage from '../pages/marketplace/MarketplacePage';
import ProductDetailsPage from '../pages/marketplace/ProductDetailsPage';
import CartPage from '../pages/marketplace/CartPage';
import CommunityPage from '../pages/community/CommunityPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ProfileCompletionPage from '../pages/auth/ProfileCompletionPage';

// Booking & Payment
import BookingCheckoutPage from '../pages/booking/BookingCheckoutPage';
import QRPaymentPage from '../pages/payment/QRPaymentPage';

// Farmer Dashboard
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import BookingsPage from '../pages/farmer/BookingsPage';
import WishlistPage from '../pages/farmer/WishlistPage';

// Owner Dashboard
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import MyEquipmentsPage from '../pages/owner/MyEquipmentsPage';
import AddEquipmentPage from '../pages/owner/AddEquipmentPage';
import RentalRequestsPage from '../pages/owner/RentalRequestsPage';
import RevenuePage from '../pages/owner/RevenuePage';

// Manufacturer Dashboard
import ManufacturerDashboard from '../pages/manufacturer/ManufacturerDashboard';
import ProductsPage from '../pages/manufacturer/ProductsPage';
import InventoryPage from '../pages/manufacturer/InventoryPage';

// Dealer Dashboard
import DealerDashboard from '../pages/dealer/DealerDashboard';

// Admin Dashboard
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagementPage from '../pages/admin/UserManagementPage';
import EquipmentManagementPage from '../pages/admin/EquipmentManagementPage';
import BookingManagementPage from '../pages/admin/BookingManagementPage';
import ReportsPage from '../pages/admin/ReportsPage';

// Common User Pages
import UserProfilePage from '../pages/profile/UserProfilePage';
import SettingsPage from '../pages/profile/SettingsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/booking/:id" element={<BookingCheckoutPage />} />
        <Route path="/payment/qr/:bookingId" element={<QRPaymentPage />} />
        <Route path="/community" element={<CommunityPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile-completion" element={<ProfileCompletionPage />} />

        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route element={<ProtectedLayout />}>
        <Route element={<DashboardLayout />}>
        {/* Farmer Dashboard */}
        <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
        <Route path="/dashboard/farmer/bookings" element={<BookingsPage />} />
        <Route path="/dashboard/farmer/wishlist" element={<WishlistPage />} />

        {/* Owner Dashboard */}
        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        <Route path="/dashboard/owner/equipments" element={<MyEquipmentsPage />} />
        <Route path="/dashboard/owner/add-equipment" element={<AddEquipmentPage />} />
        <Route path="/dashboard/owner/edit-equipment/:id" element={<AddEquipmentPage />} />
        <Route path="/dashboard/owner/requests" element={<RentalRequestsPage />} />
        <Route path="/dashboard/owner/revenue" element={<RevenuePage />} />

        {/* Manufacturer Dashboard */}
        <Route path="/dashboard/manufacturer" element={<ManufacturerDashboard />} />
        <Route path="/dashboard/manufacturer/products" element={<ProductsPage />} />
        <Route path="/dashboard/manufacturer/inventory" element={<InventoryPage />} />

        {/* Dealer Dashboard */}
        <Route path="/dashboard/dealer" element={<DealerDashboard />} />
        <Route path="/dashboard/dealer/equipments" element={<MyEquipmentsPage />} />
        <Route path="/dashboard/dealer/add-equipment" element={<AddEquipmentPage />} />
        <Route path="/dashboard/dealer/edit-equipment/:id" element={<AddEquipmentPage />} />
        <Route path="/dashboard/dealer/requests" element={<RentalRequestsPage />} />
        <Route path="/dashboard/dealer/revenue" element={<RevenuePage />} />

        {/* Admin Dashboard */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/users" element={<UserManagementPage />} />
        <Route path="/dashboard/admin/equipments" element={<EquipmentManagementPage />} />
        <Route path="/dashboard/admin/bookings" element={<BookingManagementPage />} />
        <Route path="/dashboard/admin/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

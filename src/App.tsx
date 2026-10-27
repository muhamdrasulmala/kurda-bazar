/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OrderForm } from './components/OrderForm';
import { HeroSection } from './components/HeroSection';
import { PostureSimulator } from './components/PostureSimulator';
import { ProductFeatures } from './components/ProductFeatures';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CustomerOrder } from './types/order';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isTelegramConnected, setIsTelegramConnected] = useState<boolean>(false);
  const [ordersCount, setOrdersCount] = useState<number>(0);

  const checkTelegramStatus = async () => {
    try {
      const res = await fetch('/api/telegram/config');
      const data = await res.json();
      setIsTelegramConnected(Boolean(data.isConfigured));
    } catch {
      // Offline fallback
    }
  };

  const checkOrdersCount = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrdersCount(data.orders.length);
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    checkTelegramStatus();
    checkOrdersCount();

    // Check if the URL has ?admin or #admin
    if (
      window.location.search.includes('admin') || 
      window.location.hash.includes('admin')
    ) {
      setIsAdminOpen(true);
    }
  }, []);

  const scrollToOrder = () => {
    const el = document.getElementById('order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSimulator = () => {
    const el = document.getElementById('simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSuccess = (order: CustomerOrder) => {
    setOrdersCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Navigation Bar with discreet Admin Lock button */}
      <Header
        onOpenSettings={() => setIsAdminOpen(true)}
        onOpenOrders={() => setIsAdminOpen(true)}
        onScrollToOrder={scrollToOrder}
        ordersCount={ordersCount}
        isTelegramConnected={isTelegramConnected}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. TOP PROMINENT ORDER FORM - Customer sees this immediately upon opening the link! */}
        <OrderForm
          initialWeight={75}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* 2. Hero Section with visual presentation and guarantee details */}
        <HeroSection
          onScrollToOrder={scrollToOrder}
          onScrollToSimulator={scrollToSimulator}
        />

        {/* 3. Interactive Posture Before / After Spine Simulator */}
        <PostureSimulator />

        {/* 4. Product Medical Orthopedic Features */}
        <ProductFeatures />

        {/* 5. Real Kurdish Verified Customer Reviews */}
        <CustomerReviews />

        {/* 6. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Footer with secure admin link */}
      <Footer
        onOpenSettings={() => setIsAdminOpen(true)}
        onOpenOrders={() => setIsAdminOpen(true)}
      />

      {/* SECURE PROTECTED ADMIN PANEL (Contains both Orders and Telegram Settings) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onTelegramConfigUpdated={() => {
          checkTelegramStatus();
        }}
      />

    </div>
  );
}

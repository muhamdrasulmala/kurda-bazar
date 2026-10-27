import React, { useState, useEffect } from 'react';
import { CustomerOrder } from '../types/order';
import { X, Package, Phone, MapPin, Scale, RefreshCw, CheckCircle, Clock, Truck } from 'lucide-react';

interface OrdersAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersAdminDrawer: React.FC<OrdersAdminDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (selectedFilter === 'all') return true;
    return o.status === selectedFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                ئەرشیفی داواکارییەکانی کوردە بازاڕ
              </h3>
              <span className="text-xs text-slate-400">
                کۆی داواکارییەکان: <span className="text-emerald-400 font-bold tabular-nums">{orders.length}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              title="نوێکردنەوە"
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              aria-label="داخستن"
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              selectedFilter === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            هەمووی ({orders.length})
          </button>
          <button
            onClick={() => setSelectedFilter('new')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              selectedFilter === 'new' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            نوێ ({orders.filter(o => o.status === 'new').length})
          </button>
          <button
            onClick={() => setSelectedFilter('contacted')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              selectedFilter === 'contacted' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            پەیوەندیکراو ({orders.filter(o => o.status === 'contacted').length})
          </button>
          <button
            onClick={() => setSelectedFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              selectedFilter === 'delivered' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            گەیەندراو ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Package className="w-12 h-12 mx-auto stroke-1 mb-2 text-slate-600" />
              <p className="text-sm">هیچ داواکارییەک لەم بەشەدا نییە</p>
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{ord.fullName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        #{ord.id.slice(0, 8)}
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleString('ku') : ''}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                    className="text-xs bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                  >
                    <option value="new">🟢 نوێ</option>
                    <option value="contacted">📞 پەیوەندیکراو</option>
                    <option value="shipped">🚚 نێردراو</option>
                    <option value="delivered">✅ گەیەندراو</option>
                    <option value="cancelled">❌ هەڵوەشاوە</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ord.city}{ord.customCity ? ` (${ord.customCity})` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>کێش: {ord.weightKg} کگم (سایز {ord.selectedSize})</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <a href={`tel:${ord.primaryPhone}`} className="text-emerald-400 font-mono hover:underline">
                      {ord.primaryPhone}
                    </a>
                    {ord.secondaryPhone && (
                      <span className="text-slate-400 font-mono text-[11px]">
                        (دووەم: {ord.secondaryPhone})
                      </span>
                    )}
                  </div>
                </div>

                {ord.addressDetails && (
                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-300">ناونیشان:</strong> {ord.addressDetails}
                  </div>
                )}

                {ord.notes && (
                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-300">تێبینی:</strong> {ord.notes}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                  <span className="text-slate-400">
                    بڕی پارە: <strong className="text-emerald-400 font-mono text-sm">{ord.totalPrice.toLocaleString()} دینار</strong>
                  </span>
                  <a
                    href={`https://wa.me/${ord.primaryPhone.replace(/^0/, '964')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    نامە ناردن لە واتسئەپ
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

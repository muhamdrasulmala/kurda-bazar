import React, { useState, useEffect } from 'react';
import { CustomerOrder } from '../types/order';
import { 
  X, 
  Lock, 
  Key, 
  TrendingUp, 
  Package, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Scale, 
  Search, 
  Download, 
  RefreshCw, 
  ExternalLink,
  MessageCircle,
  Truck,
  AlertCircle,
  Send,
  MessageSquare,
  Info,
  ShieldCheck,
  Settings,
  Trash2
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTelegramConfigUpdated?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onTelegramConfigUpdated
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active Tab: 'orders' or 'telegram'
  const [activeTab, setActiveTab] = useState<'orders' | 'telegram'>('orders');

  // Orders State
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Telegram Config State
  const [botToken, setBotToken] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [secondChatId, setSecondChatId] = useState<string>('');
  const [storeUsername, setStoreUsername] = useState<string>('');
  const [isSavingTg, setIsSavingTg] = useState<boolean>(false);
  const [isTestingTg, setIsTestingTg] = useState<boolean>(false);
  const [tgStatusMessage, setTgStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isTgConfigured, setIsTgConfigured] = useState<boolean>(false);

  const correctPin = 'kurdabazar1@';

  const fetchOrders = async () => {
    setIsLoading(true);
    let serverOrders: CustomerOrder[] = [];
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          serverOrders = data.orders;
        }
      }
    } catch (e) {
      console.log('Using local fallback for orders');
    }

    // Merge with local orders
    try {
      const localStr = localStorage.getItem('kurda_bazar_orders');
      if (localStr) {
        const localOrders: CustomerOrder[] = JSON.parse(localStr);
        const map = new Map<string, CustomerOrder>();
        [...serverOrders, ...localOrders].forEach(o => map.set(o.id, o));
        setOrders(Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setOrders(serverOrders);
      }
    } catch {
      setOrders(serverOrders);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTelegramConfig = async () => {
    // 1. Try local storage first
    try {
      const localTg = localStorage.getItem('kurda_bazar_tg_config');
      if (localTg) {
        const parsed = JSON.parse(localTg);
        if (parsed.botToken) setBotToken(parsed.botToken);
        if (parsed.chatId) setChatId(parsed.chatId);
        if (parsed.secondChatId) setSecondChatId(parsed.secondChatId);
        if (parsed.storeUsername) setStoreUsername(parsed.storeUsername);
        setIsTgConfigured(Boolean(parsed.botToken && parsed.chatId));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Try server
    try {
      const res = await fetch('/api/telegram/config');
      if (res.ok) {
        const data = await res.json();
        if (data.rawChatId) setChatId(data.rawChatId);
        if (data.rawSecondChatId) setSecondChatId(data.rawSecondChatId);
        if (data.storeUsername) setStoreUsername(data.storeUsername);
        setIsTgConfigured(Boolean(data.isConfigured));
      }
    } catch (e) {
      console.log('Running in static mode');
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchOrders();
      fetchTelegramConfig();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim() === correctPin || pinCode.trim() === 'kurdabazar1@') {
      setIsAuthenticated(true);
      setPinError(null);
      fetchOrders();
      fetchTelegramConfig();
    } else {
      setPinError('ڕەمزی چوونەژوورەوە هەڵەیە! تکایە ڕەمزی دروست بنووسە.');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.log(e);
    }
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o);
    setOrders(updated);
    try {
      localStorage.setItem('kurda_bazar_orders', JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('دڵنیایت لە ڕەشکردنەوەی ئەم داواکارییە؟')) return;
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.log(e);
    }
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    try {
      localStorage.setItem('kurda_bazar_orders', JSON.stringify(updated));
    } catch {}
  };

  const handleClearAllOrders = async () => {
    if (!window.confirm('ئایا دڵنیایت لە ڕەشکردنەوەی هەموو داواکارییەکان؟ ئەم کردارە ناگەڕێتەوە.')) return;
    try {
      await fetch('/api/orders', {
        method: 'DELETE'
      });
    } catch (e) {
      console.log(e);
    }
    setOrders([]);
    try {
      localStorage.removeItem('kurda_bazar_orders');
    } catch {}
  };

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTg(true);
    setTgStatusMessage(null);

    const tgData = {
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      secondChatId: secondChatId.trim(),
      storeUsername: storeUsername.trim()
    };

    // Always save to localStorage
    try {
      localStorage.setItem('kurda_bazar_tg_config', JSON.stringify(tgData));
    } catch {}

    try {
      await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tgData)
      });
    } catch (err: any) {
      console.log('Running in static mode, config saved locally');
    }

    setTgStatusMessage({
      type: 'success',
      text: secondChatId.trim()
        ? 'ڕێکخستنەکانی تیلیگرام پاشەکەوت کران! ئێستا داواکارییەکان بۆ هەردوو ئایدی چاتەکە دەچن.'
        : 'ڕێکخستنەکانی تیلیگرام بە سەرکەوتوویی پاشەکەوت کران!'
    });
    setIsTgConfigured(Boolean(botToken && chatId));
    setIsSavingTg(false);
    if (onTelegramConfigUpdated) onTelegramConfigUpdated();
  };

  const handleTestTelegram = async () => {
    setIsTestingTg(true);
    setTgStatusMessage(null);

    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: botToken.trim(),
          chatId: chatId.trim(),
          secondChatId: secondChatId.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'نەتوانرا پەیام بنێردرێت');

      setTgStatusMessage({
        type: 'success',
        text: data.message || 'نامەی تاقیکردنەوە بە سەرکەوتوویی گەیشتە سەر تیلیگرام! سیستەمەکە ئامادەیە.'
      });
    } catch (err: any) {
      setTgStatusMessage({
        type: 'error',
        text: err.message || 'هەڵە لە ناردنی پەیامی تاقیکردنەوە'
      });
    } finally {
      setIsTestingTg(false);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = ['کۆد', 'ناو', 'شار', 'ناونیشان', 'مۆبایل', 'مۆبایلی دووەم', 'کێش', 'نرخ', 'دۆخ', 'کات'];
    const rows = orders.map(o => [
      o.id.slice(0, 8),
      `"${o.fullName}"`,
      `"${o.city}"`,
      `"${o.addressDetails || ''}"`,
      `"${o.primaryPhone}"`,
      `"${o.secondaryPhone || ''}"`,
      o.weightKg,
      o.totalPrice || 15000,
      o.status,
      `"${new Date(o.createdAt).toLocaleString('ku')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kurda_bazar_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats
  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.status === 'new').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 15000), 0);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      !term ||
      o.fullName?.toLowerCase().includes(term) ||
      o.city?.toLowerCase().includes(term) ||
      o.primaryPhone?.includes(term) ||
      o.secondaryPhone?.includes(term);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                <span>بەشی ئەدمینی کوردە بازاڕ</span>
                {isAuthenticated && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold">
                    چوونەژوورەوەی سەرکەوتوو
                  </span>
                )}
              </h3>
              <span className="text-xs text-slate-400">
                تایبەت بە بەڕێوەبەری دووکان (پارێزراو بە کۆدی نهێنی)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="داخستن"
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Password Screen (PIN: 1234) */
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
              <Lock className="w-8 h-8" />
            </div>
            
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2">
              چوونەژوورەوەی ئەدمین
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              تایبەت بە بەڕێوەبەری کوردە بازاڕ. تکایە ڕەمزەکەت بنووسە.
            </p>

            {pinError && (
              <div className="w-full mb-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 text-right">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  dir="ltr"
                  autoFocus
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="ڕەمزی نهێنی بنووسە..."
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-center font-mono text-base focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                id="admin-login-btn"
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                چوونەژوورەوە بۆ بەشی ئەدمین
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard with 2 Tabs: Orders & Telegram Settings */
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {/* Navigation Tabs Inside Admin */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'orders'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>داواکارییەکانی کڕیاران ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('telegram')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'telegram'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>ڕێکخستنی تیلیگرام</span>
                  {isTgConfigured ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-400 hidden sm:block">
                کوردە بازاڕ · پانێڵی بەڕێوەبردن
              </div>
            </div>

            {/* TAB 1: ORDERS DASHBOARD */}
            {activeTab === 'orders' && (
              <div className="p-4 sm:p-6 space-y-5 flex-1">
                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">کۆی داواکارییەکان</span>
                    <span className="text-2xl font-black text-white font-mono tabular-nums">
                      {totalOrders}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">داواکارییە نوێیەکان</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                      {newOrders}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">گەیەندراوەکان</span>
                    <span className="text-2xl font-black text-teal-400 font-mono tabular-nums">
                      {deliveredOrders}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">کۆی داهات (١٥ هەزار)</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">
                      {totalRevenue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">دینار</span>
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="گەڕان بەپێی ناو، شار، مۆبایل..."
                      className="w-full pr-9 pl-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                        statusFilter === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      هەمووی ({orders.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('new')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                        statusFilter === 'new' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      نوێ ({newOrders})
                    </button>
                    <button
                      onClick={() => setStatusFilter('delivered')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                        statusFilter === 'delivered' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      گەیەندراو ({deliveredOrders})
                    </button>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={fetchOrders}
                      disabled={isLoading}
                      title="نوێکردنەوە"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={handleExportCSV}
                      disabled={orders.length === 0}
                      className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دابەزاندنی ئێکسڵ</span>
                    </button>

                    <a
                      href="/api/download-clean-zip"
                      download="kurda_bazar_clean.zip"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      title="داگرتنی تەنها فایلی کۆدەکان بە زیپ بۆ ChatGPT"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-950" />
                      <span>داگرتنی زیپ بۆ ChatGPT (تەنها کۆدەکان)</span>
                    </a>

                    <a
                      href="/kurda-bazar-clean.html"
                      download="kurda-bazar.html"
                      className="px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      title="داگرتنی یەک فایلی html"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                      <span>داگرتنی HTML</span>
                    </a>

                    {orders.length > 0 && (
                      <button
                        onClick={handleClearAllOrders}
                        className="px-3 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        title="ڕەشکردنەوەی هەموو داواکارییەکان بەیەکجار"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span className="hidden sm:inline">سڕینەوەی هەمووی</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                      <Package className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-600" />
                      <p className="text-sm">هیچ داواکارییەک نەدۆزرایەوە</p>
                    </div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/90 text-right space-y-3 transition-colors hover:border-slate-700"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-white text-base flex items-center gap-2">
                              <span>{ord.fullName}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                #{ord.id.slice(0, 8)}
                              </span>
                            </h4>
                            <span className="text-xs text-slate-500">
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleString('ku') : ''}
                            </span>
                          </div>

                          {/* Status Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">دۆخ:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                              className="text-xs bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:border-emerald-500"
                            >
                              <option value="new">🟢 نوێ</option>
                              <option value="contacted">📞 پەیوەندیکراو</option>
                              <option value="shipped">🚚 نێردراو بە گەیاندن</option>
                              <option value="delivered">✅ گەیەندراو</option>
                              <option value="cancelled">❌ هەڵوەشاوە</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer Info Strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/50">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <span className="text-slate-400 block text-[11px]">شار و شوێن:</span>
                              <span className="font-bold text-white">{ord.city}</span>
                              {ord.customCity && <span className="text-slate-400"> ({ord.customCity})</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Scale className="w-4 h-4 text-teal-400 shrink-0" />
                            <div>
                              <span className="text-slate-400 block text-[11px]">وەزن (کێش):</span>
                              <span className="font-bold text-white font-mono">{ord.weightKg} کگم</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                            <div>
                              <span className="text-slate-400 block text-[11px]">نرخ (گەیاندنی خۆڕایی):</span>
                              <span className="font-bold text-emerald-400 font-mono text-sm">
                                ١٥,٠٠٠ دینار
                              </span>
                            </div>
                          </div>
                        </div>

                        {ord.addressDetails && (
                          <div className="text-xs text-slate-400 bg-slate-900/30 px-3 py-2 rounded-lg">
                            <strong className="text-slate-300">ناونیشانی ورد:</strong> {ord.addressDetails}
                          </div>
                        )}

                        {ord.notes && (
                          <div className="text-xs text-slate-400 bg-slate-900/30 px-3 py-2 rounded-lg">
                            <strong className="text-slate-300">تێبینی کڕیار:</strong> {ord.notes}
                          </div>
                        )}

                        {/* Phone & Direct Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900">
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-slate-400">مۆبایل:</span>
                              <a href={`tel:${ord.primaryPhone}`} className="text-emerald-400 font-mono font-bold hover:underline">
                                {ord.primaryPhone}
                              </a>
                            </div>
                            {ord.secondaryPhone && (
                              <div className="text-slate-400 font-mono text-xs">
                                (دووەم: <a href={`tel:${ord.secondaryPhone}`} className="text-slate-300 hover:underline">{ord.secondaryPhone}</a>)
                              </div>
                            )}
                          </div>

                          {/* Direct WhatsApp, Call & Delete Buttons */}
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${ord.primaryPhone.replace(/^0/, '964')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>چات لە واتسئەپ</span>
                            </a>

                            <a
                              href={`tel:${ord.primaryPhone}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>تەلەفۆن</span>
                            </a>

                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              title="ڕەشکردنەوەی ئەم داواکارییە"
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>ڕەشکردنەوە</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: TELEGRAM SETTINGS (SECURELY INSIDE ADMIN) */}
            {activeTab === 'telegram' && (
              <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full space-y-6 text-right">
                
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-sky-400" />
                    <span>ڕێکخستنی بۆتی تیلیگرام بۆ گەیشتنی داواکارییەکان</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    لێرە بۆتەکەت پەیوەست بکە تاوەکو دەستبەجێ هەموو داواکارییەکان بێنە سەر تیلیگرامەکەت بە ناوی کڕیار، شار، ژمارە و کێش.
                  </p>
                </div>

                {tgStatusMessage && (
                  <div
                    className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 ${
                      tgStatusMessage.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                        : 'bg-rose-950/60 border border-rose-800 text-rose-200'
                    }`}
                  >
                    {tgStatusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span>{tgStatusMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveTelegram} className="space-y-4">
                  
                  {/* Bot Token */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>تووکنی بۆت (Bot Token):</span>
                      <a
                        href="https://t.me/BotFather"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-normal"
                      >
                        <span>وەرگرتن لە @BotFather</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        required={!isTgConfigured}
                        value={botToken}
                        onChange={(e) => setBotToken(e.target.value)}
                        placeholder={isTgConfigured ? "•••••••••••••••••••••••• (پاشەکەوتکراوە)" : "123456789:ABCdefGhIJKlmNoPQRs..."}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs font-mono"
                      />
                      <Key className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Primary Chat ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>ئایدی چاتی تیلیگرامی یەکەم (Chat ID 1):</span>
                      <a
                        href="https://t.me/userinfobot"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-normal"
                      >
                        <span>زانینی ئایدی لە @userinfobot</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        required
                        value={chatId}
                        onChange={(e) => setChatId(e.target.value)}
                        placeholder="نموونە: 987654321"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs font-mono"
                      />
                      <MessageSquare className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Secondary Chat ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>ئایدی چاتی تیلیگرامی دووەم (Chat ID 2):</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60 font-normal">
                          ئارەزوومەندانە
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-400">بۆ ئەکاونتی دووەم یان هاوکارەکەت</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        value={secondChatId}
                        onChange={(e) => setSecondChatId(e.target.value)}
                        placeholder="نموونە: 123456789 (ئارەزوومەندانە)"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs font-mono"
                      />
                      <MessageSquare className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      ئەگەر ئەمە پڕبکەیتەوە، دەستبەجێ هەموو داواکارییەکان لە یەک کاتدا بۆ هەردووکتان دەنێردرێت.
                    </p>
                  </div>

                  {/* Store Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      یوزەرنەیمی تیلیگرامت (بۆ چاتی ڕاستەوخۆ):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={storeUsername}
                      onChange={(e) => setStoreUsername(e.target.value)}
                      placeholder="e.g. kurda_bazar"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs font-mono"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <button
                      type="submit"
                      disabled={isSavingTg}
                      className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSavingTg ? 'پاشەکەوت دەکرێت...' : 'پاشەکەوتکردنی ڕێکخستنی تیلیگرام'}
                    </button>

                    <button
                      type="button"
                      disabled={isTestingTg || (!botToken && !isTgConfigured) || !chatId}
                      onClick={handleTestTelegram}
                      className="py-3 px-4 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {isTestingTg ? 'دەپشکنرێت...' : secondChatId.trim() ? 'تاقیکردنەوەی ناردن بۆ هەردووکیان' : 'تاقیکردنەوەی ناردنی نامە'}
                    </button>
                  </div>
                </form>

                {/* 1-Minute Guide */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right">
                  <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                    <Info className="w-3.5 h-3.5 text-sky-400" />
                    ڕێنمایی بەستنەوە بە دوو ئەکاونتی تیلیگرام:
                  </h5>
                  <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal list-inside pr-1">
                    <li>لە ناو تیلیگرام سێرچی <span className="text-sky-300 font-mono">@BotFather</span> بکە.</li>
                    <li>بنوسە <span className="text-sky-300 font-mono">/newbot</span> و ناو و یوزەر بۆ بۆتەکەت دیاریبکە.</li>
                    <li>کۆدی <span className="text-sky-300 font-mono">Token</span> کە پێتدەدات لێرە لە بەشی سەرەوە دابنێ.</li>
                    <li>لە <span className="text-sky-300 font-mono">@userinfobot</span> کۆدی Chat ID ی خۆت وەربگرە و لە خاڵی یەکەم دابنێ.</li>
                    <li>بۆ ئەکاونتی دووەم، ئەویش بچێتە لای <span className="text-sky-300 font-mono">@userinfobot</span> و Chat ID خۆی کۆپی بکات و لە خاڵی دووەم دایبنێت.</li>
                    <li><strong className="text-amber-300">گرنگ:</strong> پێویستە هەردوو ئەکاونتەکە بچنە ناو بۆتەکەتان و یەک جار کلیک لە <span className="text-amber-300 font-mono">/start</span> بکەن تا بۆتەکە مۆڵەتی نامە ناردنی پێبدرێت!</li>
                  </ol>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { POS_MENU, POS_TABLES } from '../constants';
import { MenuItem } from '../types';
import { Search, ShoppingCart, Plus, Minus, CreditCard, LayoutGrid, List } from 'lucide-react';

export const POS: React.FC = () => {
  const [view, setView] = useState<'menu' | 'tables'>('menu');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [category, setCategory] = useState<string>('All');

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
        if (i.item.id === id) {
            return { ...i, quantity: Math.max(0, i.quantity + delta) };
        }
        return i;
    }).filter(i => i.quantity > 0));
  };

  const total = cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);
  const categories = ['All', 'Food', 'Beverage', 'Alcohol'];

  const filteredMenu = category === 'All' ? POS_MENU : POS_MENU.filter(m => m.category === category);

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-8rem)] gap-6">
      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
             <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                 <button onClick={() => setView('menu')} className={`p-2 rounded-md ${view === 'menu' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><List className="w-5 h-5" /></button>
                 <button onClick={() => setView('tables')} className={`p-2 rounded-md ${view === 'tables' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><LayoutGrid className="w-5 h-5" /></button>
             </div>
             
             {view === 'menu' && (
                 <div className="flex gap-2 overflow-x-auto">
                    {categories.map(c => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                                category === c ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                 </div>
             )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 relative">
            {view === 'menu' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMenu.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => addToCart(item)}
                            className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                        >
                            <div className="aspect-square bg-slate-100 overflow-hidden relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <button className="absolute bottom-3 right-3 bg-white text-blue-600 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all z-20">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-slate-800 truncate text-sm">{item.name}</h4>
                                <p className="text-slate-500 text-xs mt-1">{item.category}</p>
                                <p className="text-blue-600 font-bold mt-2 text-lg">${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full w-full relative bg-slate-200 rounded-xl border-2 border-dashed border-slate-300 min-h-[400px]">
                    {POS_TABLES.map(table => (
                        <div 
                            key={table.id}
                            className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 shadow-sm cursor-pointer hover:scale-105 transition-transform ${
                                table.status === 'Occupied' ? 'bg-red-100 border-red-400 text-red-700' :
                                table.status === 'Reserved' ? 'bg-amber-100 border-amber-400 text-amber-700' :
                                'bg-emerald-100 border-emerald-400 text-emerald-700'
                            }`}
                            style={{ left: table.x, top: table.y }}
                        >
                            <span className="font-bold text-lg">{table.number}</span>
                            <span className="text-[10px] uppercase font-bold">{table.status}</span>
                        </div>
                    ))}
                    <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow opacity-80">
                         <p className="text-xs text-slate-500">Interactive Floor Plan</p>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-[500px] lg:h-auto">
        <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Current Order
            </h3>
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Table 5</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <ShoppingCart className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm">Order is empty</p>
                </div>
            ) : (
                cart.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center justify-between group">
                        <div className="flex-1 pr-4">
                            <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                            <p className="text-xs text-slate-500">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 w-6 h-6 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 text-slate-500">
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center text-slate-700">{quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 w-6 h-6 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 text-slate-500">
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="w-16 text-right font-semibold text-slate-700 text-sm">
                            ${(item.price * quantity).toFixed(2)}
                        </div>
                    </div>
                ))
            )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t border-slate-200 mt-2">
                <span>Total</span>
                <span>${(total * 1.1).toFixed(2)}</span>
            </div>
            
            <button 
                disabled={cart.length === 0}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                <CreditCard className="w-5 h-5" /> Pay Now
            </button>
        </div>
      </div>
    </div>
  );
};
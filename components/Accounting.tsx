import React, { useState } from 'react';
import { Plus, Download, Filter, MoreHorizontal, X, Save, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Invoice } from '../types';

export const Accounting = () => {
  const { invoices, addInvoice } = useAppContext();
  const [activeTab, setActiveTab] = useState('invoices');
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.includes('/invoices/create');

  const CreateInvoiceView = () => {
      const [showSuccess, setShowSuccess] = useState(false);
      
      const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          // In real app, gather form data here
          addInvoice({
              id: Date.now().toString(),
              number: `INV-${Date.now()}`,
              guestName: 'New Client',
              date: new Date().toISOString().split('T')[0],
              amount: 1500, // Mock amount
              status: 'Unpaid'
          } as Invoice);
          
          setShowSuccess(true);
      };

      if (showSuccess) {
          return (
              <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Invoice Generated</h3>
                  <p className="text-slate-500 mb-6">Invoice has been sent to accounting.</p>
                  <button onClick={() => navigate('/accounting')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Return to Invoices</button>
              </div>
          );
      }

      return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">Create New Invoice</h2>
                    <button onClick={() => navigate('/accounting')}><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               <form onSubmit={handleSubmit} className="p-8 max-w-3xl mx-auto space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                           <label className="text-xs font-bold text-slate-600 block mb-1">Guest / Company</label>
                           <input type="text" required className="w-full px-4 py-2 border rounded-lg" placeholder="Search guest..." />
                       </div>
                       <div>
                           <label className="text-xs font-bold text-slate-600 block mb-1">Due Date</label>
                           <input type="date" required className="w-full px-4 py-2 border rounded-lg" />
                       </div>
                   </div>

                   <div>
                       <label className="text-xs font-bold text-slate-600 block mb-2">Line Items</label>
                       <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
                           <table className="w-full text-left text-sm min-w-[600px]">
                               <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                   <tr>
                                       <th className="px-4 py-2">Description</th>
                                       <th className="px-4 py-2 w-24">Qty</th>
                                       <th className="px-4 py-2 w-32">Price</th>
                                       <th className="px-4 py-2 w-32 text-right">Total</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                   <tr>
                                       <td className="px-4 py-2"><input type="text" placeholder="Item name" className="w-full outline-none" /></td>
                                       <td className="px-4 py-2"><input type="number" defaultValue={1} className="w-full outline-none" /></td>
                                       <td className="px-4 py-2"><input type="number" placeholder="0.00" className="w-full outline-none" /></td>
                                       <td className="px-4 py-2 text-right text-slate-400">$0.00</td>
                                   </tr>
                               </tbody>
                           </table>
                           <button type="button" className="w-full py-2 text-center text-blue-600 font-medium hover:bg-slate-50 text-xs border-t border-slate-100">
                               + Add Line Item
                           </button>
                       </div>
                   </div>

                   <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => navigate('/accounting')} className="px-6 py-2 border text-slate-600 rounded-lg font-medium">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700">Create Invoice</button>
                   </div>
               </form>
          </div>
      );
  }

  const renderContent = () => {
    if (isCreate) return <CreateInvoiceView />;

    switch(activeTab) {
        case 'general-ledger':
            return <div className="p-8 text-center text-slate-500">General Ledger View - Placeholder</div>;
        case 'cashflow':
            return <div className="p-8 text-center text-slate-500">Cashflow Analysis View - Placeholder</div>;
        default:
            return (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Invoice #</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Bill To</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{inv.number}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{inv.date}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{inv.guestName}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">${inv.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                            inv.status === 'Unpaid' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
    }
  };

  return (
    <div className="space-y-6">
        {!isCreate && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['invoices', 'general-ledger', 'cashflow', 'accounts-payable'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`capitalize px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none justify-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button 
                        onClick={() => navigate('/accounting/invoices/create')}
                        className="flex-1 md:flex-none justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Invoice
                    </button>
                </div>
            </div>
        )}
        {renderContent()}
    </div>
  );
};
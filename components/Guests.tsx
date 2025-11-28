
import React, { useState } from 'react';
import { Search, Plus, User, Building2, Phone, Mail, Edit, X, Save, Trash2, CreditCard, Tag } from 'lucide-react';
import { Guest, Company, Invoice } from '../types';
import { useAppContext } from '../context/AppContext';

interface GuestFormProps {
    onSubmit: (formData: FormData) => void;
    companies: Company[];
    initialData: Guest | null;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSubmit, companies, initialData }) => {
    // Pricing State
    const [basePrice, setBasePrice] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [giveDiscount, setGiveDiscount] = useState(false);

    // Calculate discount
    const discountPercent = basePrice > 0 ? ((basePrice - amountPaid) / basePrice) * 100 : 0;
    const discountValue = Math.max(0, basePrice - amountPaid);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        // Ensure amountPaid is correctly set in formData if needed, 
        // though the input 'name="paymentAmount"' handles it naturally.
        onSubmit(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">First Name</label>
                    <input name="firstName" required type="text" defaultValue={initialData?.firstName} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Last Name</label>
                    <input name="lastName" required type="text" defaultValue={initialData?.lastName} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Email</label>
                <input name="email" required type="email" defaultValue={initialData?.email} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Phone</label>
                <input name="phone" type="tel" defaultValue={initialData?.phone} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">ID Type</label>
                    <select name="idType" defaultValue={initialData?.idType} className="w-full px-3 py-2 border rounded-lg bg-white outline-none focus:border-blue-500">
                        <option>Passport</option>
                        <option>Driver's License</option>
                        <option>National ID</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">ID Number</label>
                    <input name="idNumber" type="text" defaultValue={initialData?.idNumber} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Company (Optional)</label>
                <select name="company" defaultValue={initialData?.company} className="w-full px-3 py-2 border rounded-lg bg-white outline-none focus:border-blue-500">
                    <option value="">None</option>
                    {companies.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
            </div>
            
            {/* Payment Section - Only for new guests */}
            {!initialData && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <Tag className="w-3 h-3 text-blue-600" /> Initial Payment
                        </h4>
                        <div className="flex items-center gap-2">
                            <input 
                                id="guestDiscount"
                                type="checkbox"
                                checked={giveDiscount}
                                onChange={(e) => {
                                    setGiveDiscount(e.target.checked);
                                    if(!e.target.checked) setAmountPaid(basePrice);
                                }}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300"
                            />
                            <label htmlFor="guestDiscount" className="text-xs font-bold text-slate-600 select-none cursor-pointer">Give Discount</label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Standard Rate</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input 
                                    type="number" 
                                    value={basePrice}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setBasePrice(val);
                                        if(!giveDiscount) setAmountPaid(val);
                                    }}
                                    className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-700 outline-none focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Method</label>
                            <select name="paymentMethod" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium text-sm outline-none">
                                <option>Cash</option>
                                <option>Credit Card</option>
                                <option>Bank Transfer</option>
                                <option>POS Terminal</option>
                            </select>
                        </div>
                    </div>

                    {giveDiscount && basePrice > 0 && (
                        <div className="flex justify-between items-center bg-emerald-50 p-2 rounded border border-emerald-100">
                            <span className="text-xs font-bold text-emerald-700">Discount Applied</span>
                            <div className="text-right">
                                <span className="block text-sm font-bold text-emerald-700">-${discountValue.toFixed(2)}</span>
                                <span className="text-[10px] text-emerald-600 font-medium">{discountPercent.toFixed(0)}% Off</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-blue-600 uppercase">Amount To Pay</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800 font-bold">$</span>
                            <input 
                                name="paymentAmount"
                                type="number"
                                value={amountPaid}
                                onChange={(e) => {
                                    if(giveDiscount) setAmountPaid(Number(e.target.value));
                                }}
                                readOnly={!giveDiscount}
                                className={`w-full pl-8 pr-4 py-3 border rounded-lg font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                                    giveDiscount ? 'bg-white border-blue-300 text-blue-700' : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                                }`}
                            />
                        </div>
                    </div>
                </div>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                {initialData ? 'Update Guest Profile' : 'Create Guest & Process Payment'}
            </button>
        </form>
    );
};

interface CompanyFormProps {
    onSubmit: (formData: FormData) => void;
    initialData: Company | null;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, initialData }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        onSubmit(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Company Name</label>
                <input name="name" required type="text" defaultValue={initialData?.name} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Contact Person</label>
                <input name="contactPerson" required type="text" defaultValue={initialData?.contactPerson} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Email</label>
                <input name="email" required type="email" defaultValue={initialData?.email} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Rate Code</label>
                    <input name="rateCode" type="text" defaultValue={initialData?.rateCode} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Credit Limit ($)</label>
                    <input name="creditLimit" type="number" defaultValue={initialData?.creditLimit || 1000} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                {initialData ? 'Update Company' : 'Create Company'}
            </button>
        </form>
    );
};

export const Guests = () => {
  const { guests, companies, addGuest, updateGuest, addCompany, updateCompany, deleteCompany, addInvoice } = useAppContext();
  const [activeTab, setActiveTab] = useState<'guests' | 'companies'>('guests');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Guest | Company | null>(null);
  const [editingItem, setEditingItem] = useState<Guest | Company | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // -- Actions --

  const handleView = (item: Guest | Company) => {
      setSelectedItem(item);
      setShowViewModal(true);
  };

  const handleEdit = (e: React.MouseEvent, item: Guest | Company) => {
      e.stopPropagation();
      setEditingItem(item);
      setShowModal(true);
  };

  const handleDeleteCompany = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm("Are you sure you want to delete this company?")) {
          deleteCompany(id);
      }
  };

  const handleAdd = () => {
      setEditingItem(null);
      setShowModal(true);
  };

  const handleGuestSave = (formData: FormData) => {
    const newGuest: any = {
        id: editingItem?.id || Date.now().toString(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        idType: formData.get('idType'),
        idNumber: formData.get('idNumber'),
        company: formData.get('company'),
    };

    if (editingItem) {
        updateGuest(newGuest);
    } else {
        addGuest(newGuest);
        // Handle Initial Payment
        const paymentAmount = Number(formData.get('paymentAmount'));
        if (paymentAmount > 0) {
            addInvoice({
                id: Date.now().toString(),
                number: `INV-${Date.now()}`,
                guestName: `${newGuest.firstName} ${newGuest.lastName}`,
                date: new Date().toISOString().split('T')[0],
                amount: paymentAmount,
                status: 'Paid'
            } as Invoice);
        }
    }
    finishSave();
  };

  const handleCompanySave = (formData: FormData) => {
      const newCompany: any = {
          id: editingItem?.id || Date.now().toString(),
          name: formData.get('name'),
          contactPerson: formData.get('contactPerson'),
          email: formData.get('email'),
          rateCode: formData.get('rateCode'),
          creditLimit: Number(formData.get('creditLimit')),
      };
      if (editingItem) updateCompany(newCompany);
      else addCompany(newCompany);
      finishSave();
  };

  const finishSave = () => {
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
  }

  // -- Details View --
  
  const ViewModal = () => {
      if (!selectedItem) return null;
      const isGuest = 'firstName' in selectedItem;

      return (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isGuest ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                               {isGuest ? <User className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-slate-800">
                                  {isGuest ? `${(selectedItem as Guest).firstName} ${(selectedItem as Guest).lastName}` : (selectedItem as Company).name}
                              </h3>
                              <p className="text-sm text-slate-500">{isGuest ? 'Guest Profile' : 'Corporate Profile'}</p>
                          </div>
                      </div>
                      <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="space-y-4">
                      {isGuest ? (
                          <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div><label className="text-xs text-slate-500 block">Email</label><span className="font-medium">{(selectedItem as Guest).email}</span></div>
                                  <div><label className="text-xs text-slate-500 block">Phone</label><span className="font-medium">{(selectedItem as Guest).phone}</span></div>
                                  <div><label className="text-xs text-slate-500 block">ID Type</label><span className="font-medium">{(selectedItem as Guest).idType}</span></div>
                                  <div><label className="text-xs text-slate-500 block">ID Number</label><span className="font-medium">{(selectedItem as Guest).idNumber}</span></div>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-lg">
                                  <label className="text-xs text-slate-500 block mb-1">Company Association</label>
                                  <span className="font-bold text-slate-800">{(selectedItem as Guest).company || 'N/A'}</span>
                              </div>
                          </>
                      ) : (
                          <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div><label className="text-xs text-slate-500 block">Contact Person</label><span className="font-medium">{(selectedItem as Company).contactPerson}</span></div>
                                  <div><label className="text-xs text-slate-500 block">Email</label><span className="font-medium">{(selectedItem as Company).email}</span></div>
                                  <div><label className="text-xs text-slate-500 block">Rate Code</label><span className="font-medium">{(selectedItem as Company).rateCode}</span></div>
                              </div>
                              <div className="bg-indigo-50 p-3 rounded-lg flex justify-between items-center border border-indigo-100">
                                  <span className="text-xs font-bold text-indigo-700">Credit Limit</span>
                                  <span className="font-bold text-indigo-700">${(selectedItem as Company).creditLimit?.toLocaleString()}</span>
                              </div>
                          </>
                      )}
                  </div>

                  <div className="mt-6 flex justify-end">
                      <button onClick={(e) => { setShowViewModal(false); handleEdit(e, selectedItem); }} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">
                          Edit Profile
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 relative">
        {showSuccess && (
            <div className="absolute top-0 right-0 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-5">
                <Save className="w-4 h-4" /> Changes saved successfully!
            </div>
        )}

        {/* Edit/Add Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h3 className="text-lg font-bold text-slate-800">
                            {editingItem ? 'Edit' : 'Add'} {activeTab === 'guests' ? 'Guest' : 'Company'}
                        </h3>
                        <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {activeTab === 'guests' ? (
                        <GuestForm 
                            onSubmit={handleGuestSave} 
                            companies={companies} 
                            initialData={editingItem as Guest} 
                        />
                    ) : (
                        <CompanyForm 
                            onSubmit={handleCompanySave} 
                            initialData={editingItem as Company} 
                        />
                    )}
                </div>
            </div>
        )}

        {/* View Details Modal */}
        {showViewModal && <ViewModal />}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex gap-4">
                 <button 
                    onClick={() => setActiveTab('guests')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'guests' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                 >
                    Guests
                 </button>
                 <button 
                    onClick={() => setActiveTab('companies')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'companies' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                 >
                    Companies
                 </button>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button 
                    onClick={handleAdd}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" /> Add {activeTab === 'guests' ? 'Guest' : 'Company'}
                </button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
            {activeTab === 'guests' ? (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Guest Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ID Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {guests.map((guest) => (
                            <tr key={guest.id} onClick={() => handleView(guest)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {guest.firstName[0]}{guest.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{guest.firstName} {guest.lastName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Mail className="w-3 h-3" /> {guest.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Phone className="w-3 h-3" /> {guest.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {guest.idType} <span className="text-slate-400">({guest.idNumber})</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {guest.company || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={(e) => handleEdit(e, guest)}
                                        className="p-2 hover:bg-blue-50 rounded-full text-slate-400 hover:text-blue-600"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contact Person</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Credit Limit</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Rate Code</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {companies.map((company) => (
                            <tr key={company.id} onClick={() => handleView(company)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{company.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{company.contactPerson}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-1 font-bold text-slate-700">
                                        <CreditCard className="w-3 h-3 text-slate-400" />
                                        ${company.creditLimit?.toLocaleString() || 0}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono font-bold">
                                        {company.rateCode}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-1">
                                    <button 
                                        onClick={(e) => handleEdit(e, company)}
                                        className="p-2 hover:bg-blue-50 rounded-full text-slate-400 hover:text-blue-600"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => handleDeleteCompany(e, company.id)}
                                        className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
};

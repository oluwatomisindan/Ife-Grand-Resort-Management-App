import React from 'react';
import { AlertOctagon, Lock, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Error404 = () => (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <FileQuestion className="w-24 h-24 text-slate-300 mb-6" />
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-xl text-slate-600 mb-8">Page Not Found</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Return Home
        </Link>
    </div>
);

export const Error403 = () => (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <Lock className="w-24 h-24 text-slate-300 mb-6" />
        <h1 className="text-4xl font-bold text-slate-900 mb-2">403</h1>
        <p className="text-xl text-slate-600 mb-8">Access Denied</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Return Home
        </Link>
    </div>
);

export const Error500 = () => (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <AlertOctagon className="w-24 h-24 text-red-200 mb-6" />
        <h1 className="text-4xl font-bold text-slate-900 mb-2">500</h1>
        <p className="text-xl text-slate-600 mb-8">Internal Server Error</p>
        <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
            Reload Page
        </button>
    </div>
);
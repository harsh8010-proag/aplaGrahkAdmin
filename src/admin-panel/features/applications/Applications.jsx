import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, XCircle, Download, Check, X } from 'lucide-react';
import StatCard from '../../../shared/components/StatCard';
import Button from '../../../shared/components/Button';
import SearchInput from '../../../shared/components/SearchInput';
import Table from '../../../shared/components/Table';

const mockApplications = [
  {
    id: 'APP-1234567',
    userName: 'John Doe',
    phone: '+91 8585 454 555',
    service: 'Aadhaar Certificate',
    submittedOn: '12/05/2026',
    payment: 'Pending',
    status: 'Pending',
  },
  {
    id: 'APP-1234567',
    userName: 'John Doe',
    phone: '+91 8585 454 555',
    service: 'Aadhaar Certificate',
    submittedOn: '12/05/2026',
    payment: 'Success',
    status: 'Rejected',
  },
  {
    id: 'APP-1234567',
    userName: 'John Doe',
    phone: '+91 8585 454 555',
    service: 'Aadhaar Certificate',
    submittedOn: '12/05/2026',
    payment: 'Failed',
    status: 'Approved',
  }
];

export default function Applications() {
  const navigate = useNavigate();

  const columns = [
    'Application ID',
    'User Name',
    'Service',
    'Submitted On',
    'Payment',
    'Status',
    'Actions'
  ];

  const getPaymentBadge = (payment) => {
    switch (payment) {
      case 'Pending':
        return <span className="px-3.5 py-1 bg-[#FFEDD5] text-[#F97316] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">Pending</span>;
      case 'Success':
        return <span className="px-3.5 py-1 bg-[#DCFCE7] text-[#22C55E] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">Success</span>;
      case 'Failed':
        return <span className="px-3.5 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">Failed</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3.5 py-1 bg-[#FFEDD5] text-[#F97316] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">Pending</span>;
      case 'Rejected':
        return <span className="px-3.5 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">Rejected</span>;
      case 'Approved':
        return <span className="px-3.5 py-1 bg-[#DCFCE7] text-[#22C55E] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">Approved</span>;
      default:
        return null;
    }
  };

  const renderRow = (app, idx) => (
    <tr key={idx} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === mockApplications.length - 1 ? 'border-none' : ''}`}>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {app.id}
      </td>
      <td className="px-6 py-4 font-bold flex items-center space-x-3 whitespace-nowrap">
        <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
          JD
        </div>
        <div>
          <div className="text-gray-900">{app.userName}</div>
          <div className="text-gray-400 font-normal text-xs">{app.phone}</div>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {app.service}
      </td>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {app.submittedOn}
      </td>
      <td className="px-6 py-4">
        {getPaymentBadge(app.payment)}
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(app.status)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(`/requests/${app.id}`)}
            className="text-[#041A40] transition-transform hover:scale-110 focus:outline-none flex items-center justify-center w-6 h-6"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </button>
          <button className="w-6 h-6 rounded-full bg-[#22C55E] text-white flex items-center justify-center hover:scale-110 transition-transform">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
          <button className="w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform">
            <X className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderMobileCard = (app, idx) => (
    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            JD
          </div>
          <div>
            <div className="text-gray-900 font-bold text-base leading-tight">{app.userName}</div>
            <div className="text-gray-400 text-xs font-normal mt-0.5">{app.phone}</div>
          </div>
        </div>
        <div className="text-xs font-bold text-gray-500">{app.id}</div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Service</p>
        <div className="text-gray-700 text-sm font-bold">{app.service}</div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Submitted On</p>
          <p className="text-gray-800 text-sm font-bold">{app.submittedOn}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getPaymentBadge(app.payment)}
          {getStatusBadge(app.status)}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-3 border-t border-gray-100">
        <button 
          onClick={() => navigate(`/requests/${app.id}`)}
          className="text-[#041A40] transition-transform hover:scale-110 focus:outline-none flex flex-col items-center justify-center w-8 h-8"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center hover:scale-110 transition-transform">
          <Check className="w-4 h-4" strokeWidth={3} />
        </button>
        <button className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform">
          <X className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#041A40] mb-1">Applications</h1>
        <p className="text-gray-600 font-bold text-sm">
          Review, verify and process citizen service applications.
        </p>
      </div>

      {/* Stat Cards & Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="All Applications"
          value="1200"
          icon={FileText}
          iconBgColor="bg-[#FF8303]"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        <StatCard 
          title="Pending Applications"
          value="02"
          icon={Clock}
          iconBgColor="bg-[#FACC15]"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        <StatCard 
          title="Approved Applications"
          value="02"
          icon={CheckCircle2}
          iconBgColor="bg-[#22C55E]"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        <StatCard 
          title="Rejected Applications"
          value="02"
          icon={XCircle}
          iconBgColor="bg-[#EF4444]"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        
        {/* Export Button in 5th column space */}
        <div className="flex justify-end items-end h-full">
          <Button icon={Download}>Export</Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-3xl p-6 shadow-sm border border-slate-100" style={{ backgroundColor: '#D9D9D938' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h2 className="text-xl font-bold text-[#041A40]">All Applications</h2>
          
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <select className="w-full sm:w-auto px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF8303]/20 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-no-repeat bg-[position:calc(100%-1rem)_center]">
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <SearchInput 
              placeholder="Search user" 
              showFilter={false} 
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Using a custom table class to override the header background color inline, or just relying on Table component default. 
            The reusable Table component uses bg-[#E1F5FE]. In the UI it's light cyan which is very close to E1F5FE. */}
        <div className="[&_thead]:bg-[#D4F4FA]">
          <Table 
            columns={columns}
            data={mockApplications}
            renderRow={renderRow}
            renderMobileCard={renderMobileCard}
          />
        </div>
      </div>
    </div>
  );
}

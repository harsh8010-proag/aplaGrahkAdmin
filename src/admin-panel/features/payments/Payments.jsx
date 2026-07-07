import React from 'react';
import { CreditCard, XCircle, Download } from 'lucide-react';
import StatCard from '../../../shared/components/StatCard';
import Button from '../../../shared/components/Button';
import SearchInput from '../../../shared/components/SearchInput';
import Table from '../../../shared/components/Table';

const mockPayments = [
  {
    transactionId: 'TXN-1234567',
    userName: 'John Doe',
    phone: '+91 8585 454 555',
    method: 'UPI',
    payment: 'Success',
    date: '12/05/2026',
    amount: '₹199'
  },
  {
    transactionId: 'TXN-1234567',
    userName: 'John Doe',
    phone: '+91 8585 454 555',
    method: 'UPI',
    payment: 'Failed',
    date: '12/05/2026',
    amount: '₹199'
  },
  {
    transactionId: 'TXN-1234567',
    userName: 'John Doe',
    phone: '+91 8585 454 555',
    method: 'UPI',
    payment: 'Failed',
    date: '12/05/2026',
    amount: '₹199'
  }
];

export default function Payments() {
  const columns = [
    'Transaction ID',
    'User Name',
    'Method',
    'Payment',
    'Date',
    'Amount'
  ];

  const getPaymentBadge = (payment) => {
    if (payment === 'Success') {
      return <span className="px-3.5 py-1 bg-[#DCFCE7] text-[#22C55E] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">Success</span>;
    }
    if (payment === 'Failed') {
      return <span className="px-3.5 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">Failed</span>;
    }
    return <span className="px-3.5 py-1 bg-[#FFEDD5] text-[#F97316] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">{payment}</span>;
  };

  const renderRow = (txn, idx) => (
    <tr key={idx} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === mockPayments.length - 1 ? 'border-none' : ''}`}>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {txn.transactionId}
      </td>
      <td className="px-6 py-4 font-bold flex items-center space-x-3 whitespace-nowrap">
        <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
          JD
        </div>
        <div>
          <div className="text-gray-900">{txn.userName}</div>
          <div className="text-gray-400 font-normal text-xs">{txn.phone}</div>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {txn.method}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getPaymentBadge(txn.payment)}
      </td>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {txn.date}
      </td>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {txn.amount}
      </td>
    </tr>
  );

  const renderMobileCard = (txn, idx) => (
    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            JD
          </div>
          <div>
            <div className="text-gray-900 font-bold text-base leading-tight">{txn.userName}</div>
            <div className="text-gray-400 text-xs font-normal mt-0.5">{txn.phone}</div>
          </div>
        </div>
        <div className="text-xs font-bold text-gray-500">{txn.transactionId}</div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Date</p>
          <p className="text-gray-800 text-sm font-bold">{txn.date}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getPaymentBadge(txn.payment)}
          <p className="text-gray-800 text-sm font-bold mt-1">{txn.amount}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#041A40] mb-1">Payments</h1>
        <p className="text-gray-600 font-bold text-sm">
          Track every rupee transactions, settlements.
        </p>
      </div>

      {/* Stat Cards & Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Revenue"
          value="₹48.62L"
          icon={CreditCard}
          iconBgColor="bg-[#FF8303]"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        <StatCard 
          title="Failed Payments"
          value="02"
          icon={XCircle}
          iconBgColor="bg-[#EF4444]"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        
        {/* Empty slots for 3rd and 4th column */}
        <div className="hidden lg:block"></div>
        <div className="hidden lg:block"></div>
        
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
              <option>Success</option>
              <option>Failed</option>
              <option>Pending</option>
            </select>

            <SearchInput 
              placeholder="Search user" 
              showFilter={false} 
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="[&_thead]:bg-[#D4F4FA]">
          <Table 
            columns={columns}
            data={mockPayments}
            renderRow={renderRow}
            renderMobileCard={renderMobileCard}
          />
        </div>
      </div>
    </div>
  );
}

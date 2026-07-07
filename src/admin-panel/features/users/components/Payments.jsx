export default function Payments({ payments }) {
  return (
    <div className="animate-fadeIn">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[#041A40] bg-[#E1F5FE] font-bold">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">Transaction ID</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 rounded-tr-xl">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {payments.map((txn, idx) => (
              <tr 
                key={idx} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === payments.length - 1 ? 'border-none' : ''}`}
              >
                <td className="px-6 py-4 font-bold text-gray-500 whitespace-nowrap">
                  {txn.id}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                  {txn.service}
                </td>
                <td className="px-6 py-4 font-bold text-gray-500 whitespace-nowrap">
                  {txn.method}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1.5 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                    txn.payment === 'Success' ? 'bg-[#E6F9F0] text-[#00A962]' :
                    txn.payment === 'Pending' ? 'bg-[#FFEAD6] text-[#FF8303]' :
                    'bg-[#FEECEB] text-[#D93025]'
                  }`}>
                    {txn.payment}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-500 whitespace-nowrap">
                  {txn.date}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                  {txn.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {payments.map((txn, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">{txn.id}</span>
              <span className="text-sm font-bold text-[#041A40]">{txn.amount}</span>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-[#041A40]">{txn.service}</h4>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-gray-50 text-xs">
              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Date</span>
                <span className="font-bold text-gray-600">{txn.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                  {txn.method}
                </span>
                <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                  txn.payment === 'Success' ? 'bg-[#E6F9F0] text-[#00A962]' :
                  txn.payment === 'Pending' ? 'bg-[#FFEAD6] text-[#FF8303]' :
                  'bg-[#FEECEB] text-[#D93025]'
                }`}>
                  {txn.payment}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

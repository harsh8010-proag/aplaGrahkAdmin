export default function Applications({ applications }) {
  return (
    <div className="animate-fadeIn">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[#041A40] bg-[#E1F5FE] font-bold">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">Application ID</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {applications.map((app, idx) => (
              <tr 
                key={idx} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === applications.length - 1 ? 'border-none' : ''}`}
              >
                <td className="px-6 py-4 font-bold text-gray-500 whitespace-nowrap">
                  {app?.id}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                  {app?.service}
                </td>
                <td className="px-6 py-4 font-bold text-gray-500 whitespace-nowrap">
                  {app?.submitted}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1.5 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                    app?.payment === 'Success' ? 'bg-[#E6F9F0] text-[#00A962]' :
                    app?.payment === 'Pending' ? 'bg-[#FFEAD6] text-[#FF8303]' :
                    'bg-[#FEECEB] text-[#D93025]'
                  }`}>
                    {app.payment}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1.5 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                    app?.status === 'Approved' ? 'bg-[#E6F9F0] text-[#00A962]' :
                    app?.status === 'Pending' ? 'bg-[#FFEAD6] text-[#FF8303]' :
                    'bg-[#FFEAD6] text-[#FF8303]'
                  }`}>
                    {app?.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="w-8 h-8 rounded-full bg-[#041A40] text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none shadow-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {applications.map((app, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">{app.id}</span>
              <button className="w-8 h-8 rounded-full bg-[#041A40] text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-[#041A40]">{app?.service}</h4>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-gray-50 text-xs">
              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Submitted</span>
                <span className="font-bold text-gray-600">{app?.submitted}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                  app?.payment === 'Success' ? 'bg-[#E6F9F0] text-[#00A962]' :
                  app?.payment === 'Pending' ? 'bg-[#FFEAD6] text-[#FF8303]' :
                  'bg-[#FEECEB] text-[#D93025]'
                }`}>
                  {app?.payment}
                </span>
                <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                  app?.status === 'Approved' ? 'bg-[#E6F9F0] text-[#00A962]' :
                  app?.status === 'Pending' ? 'bg-[#FFEAD6] text-[#FF8303]' :
                  'bg-[#FFEAD6] text-[#FF8303]'
                }`}>
                  {app?.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

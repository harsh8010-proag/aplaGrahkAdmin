import React from 'react';

export default function Table({ 
  columns, 
  data, 
  renderRow, 
  renderMobileCard 
}) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-[#041A40] bg-[#E1F5FE] font-bold">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-4 ${index === 0 ? 'rounded-tl-xl' : ''} ${index === columns.length - 1 ? 'rounded-tr-xl' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
        {data.map((item, index) => renderMobileCard(item, index))}
      </div>
    </>
  );
}

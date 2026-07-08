import React from 'react';

const SkeletonRow = ({ columnsCount }) => (
  <tr className="border-b border-gray-100 animate-pulse">
    {Array.from({ length: columnsCount }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

const SkeletonMobileCard = () => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="space-y-2">
      <div className="h-2.5 bg-gray-200 rounded w-16"></div>
      <div className="h-4 bg-gray-200 rounded w-28"></div>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-2.5 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      </div>
    </div>
  </div>
);

export default function Table({
  columns,
  data,
  renderRow,
  renderMobileCard,
  isLoading = false,
  skeletonRows = 5,
}) {
  const isEmpty = !isLoading && (!data || data.length === 0);

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
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <SkeletonRow key={i} columnsCount={columns.length} />
              ))
            ) : isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-400 font-bold">
                  No User Found
                </td>
              </tr>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonMobileCard key={i} />)
        ) : isEmpty ? (
          <div className="text-center text-gray-400 font-bold py-10">
            No User Found
          </div>
        ) : (
          data.map((item, index) => renderMobileCard(item, index))
        )}
      </div>
    </>
  );
}
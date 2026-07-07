import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function SearchInput({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  showFilter = false,
  onFilterClick,
  className = ''
}) {
  return (
    <div className={`flex items-center space-x-3 w-full sm:w-auto ${className}`}>
      <div className="relative flex-1 sm:w-auto">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF8303]/20 focus:border-[#FF8303] transition-all placeholder:text-gray-400 placeholder:font-normal"
        />
      </div>
      
      {showFilter && (
        <button 
          onClick={onFilterClick}
          className="p-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8303]/20 shrink-0"
          title="Filter"
        >
          <Filter className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

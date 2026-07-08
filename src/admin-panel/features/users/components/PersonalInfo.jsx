export default function PersonalInfo({ user }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-bold text-[#041A40] mb-3">Name</label>
          <div className="w-full bg-[#f3f4f6] border border-transparent rounded-xl px-4 py-3.5 text-sm text-gray-500 font-bold focus:outline-none">
            {user?.name}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-[#041A40] mb-3">Contact No</label>
          <div className="w-full bg-[#f3f4f6] border border-transparent rounded-xl px-4 py-3.5 text-sm text-gray-500 font-bold focus:outline-none">
            {user?.contactNo}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-[#041A40] mb-3">Address</label>
        <div className="w-full bg-[#f3f4f6] border border-transparent rounded-xl px-4 py-3.5 text-sm text-gray-500 font-bold focus:outline-none">
          {user?.address}
        </div>
      </div>
    </div>
  );
}

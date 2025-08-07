// src/components/dashboard/Header.tsx
export default function Header() {
  return (
    // Header
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Welcome !</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 bg-white rounded-full shadow border">
          <i className="bx bx-search text-xl"></i>
        </button>
        <button className="p-2 bg-white rounded-full shadow border">
          <i className="bx bx-bell text-xl"></i>
        </button>
        <div className="flex items-center gap-2 bg-[#f7f7f8] py-1.5 px-4 rounded-full">
          <span className="text-sm font-medium">Diptesh</span>
          <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border">
            {/* Use a placeholder or user's avatar */}
            <i className="bx bx-user text-2xl text-gray-400"></i>
          </span>
          <i className="bx bx-chevron-down text-xl text-gray-500"></i>
        </div>
      </div>
    </div>
  );
}

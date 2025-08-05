// src/components/dashboard/SpentChart.tsx
export default function SpentChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Spent Analysis</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-xs text-gray-500">Spent Trend</span>
          </span>
          <select className="ml-4 bg-gray-100 rounded-md px-3 py-1 text-xs font-medium">
            <option>This Month</option>
          </select>
        </div>
      </div>
      {/* Simulated chart - for pixel-perfect, replace with recharts/BarChart if available */}
      <div className="w-full h-56 flex items-end gap-3">
        {/* Render 12 bars matching the image */}
        {[
          80, 90, 95, 75, 90, 70, 92, 65, 70, 88, 80, 90  // Simulate proportions
        ].map((height, i) => (
          <div
            key={i}
            className={`flex-1 flex flex-col items-center`}
          >
            <div className={`relative w-6 rounded-md
                ${i === 6 ? 'bg-gradient-to-t from-blue-800 to-blue-400' : 'bg-blue-300'}
              `}
              style={{ height: `${height}%`, minHeight: '1.2rem' }}>
              {i === 6 && (
                <span className="absolute left-1/2 -top-8 -translate-x-1/2 px-2 py-1 bg-[#101728] text-white text-xs rounded shadow">
                  $89,492 July '25
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


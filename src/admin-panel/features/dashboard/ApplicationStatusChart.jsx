import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";


export default function ApplicationStatusChart({ data }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div
      className="rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col"
      style={{ backgroundColor: "#D9D9D938" }}
    >
      <div className="mb-2">
        <h3 className="font-bold text-gray-900 text-lg">Application Status</h3>
        <p className="text-sm text-gray-500 font-bold">Real-time breakdown</p>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center -mt-4"
        style={{ minHeight: 250 }}
      >
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          <div className="text-2xl font-bold text-gray-900">
  {total}
</div>
          <div className="text-xs text-gray-400 font-bold tracking-wider">
            TOTAL
          </div>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm font-bold text-gray-600">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

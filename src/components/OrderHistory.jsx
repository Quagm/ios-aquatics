export default function OrderHistory({ orders = [] }) {
  const defaultOrders = [
    {
      id: "12345",
      date: "Dec 15, 2023",
      items: "Tropical Fish - Neon Tetra x2",
      total: 50.00,
      status: "Delivered",
      statusColor: "bg-green-500/20 text-green-300"
    },
    {
      id: "12344",
      date: "Dec 10, 2023",
      items: "Aquarium Filter + Fish Food",
      total: 60.00,
      status: "Shipped",
      statusColor: "bg-blue-500/20 text-blue-300"
    }
  ]

  const ordersToShow = orders.length > 0 ? orders : defaultOrders

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-white border-b border-white/30 pb-3">
        Recent Orders
      </h2>
      
      <div className="space-y-6">
        {ordersToShow.map((order) => (
          <div key={order.id} className="border border-white/30 rounded-lg p-6 bg-white/5">
            <div className="flex justify-between items-start mb-3">
              <span className="font-medium text-white">Order #{order.id}</span>
              <span className="text-sm text-white/70">{order.date}</span>
            </div>
            <p className="text-sm text-white/70 mb-3">{order.items}</p>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#6c47ff]">${order.total.toFixed(2)}</span>
              <span className={`text-sm ${order.statusColor} px-3 py-1 rounded-full`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-full hover:bg-gray-300 transition-colors font-medium">
        View All Orders
      </button>
    </div>
  )
}

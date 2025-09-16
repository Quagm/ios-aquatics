export default function ProductSpecifications({ specifications }) {
  return (
    <div className="border-t border-white/30 pt-8">
      <h3 className="text-xl font-semibold text-white mb-6">Specifications</h3>
      <div className="space-y-4">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="flex justify-between py-2">
            <span className="text-white/70 text-lg">{key}:</span>
            <span className="font-medium text-white text-lg">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatsContainer() {
    return (
      <div className="w-full py-16 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-4xl font-bold mb-2">15k+</h2>
            <p className="text-gray-600">Active user</p>
          </div>
          <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-4xl font-bold mb-2">30k</h2>
            <p className="text-gray-600">Total Download</p>
          </div>
          <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-4xl font-bold mb-2">10k</h2>
            <p className="text-gray-600">Customer</p>
          </div>
        </div>
      </div>
    );
  }
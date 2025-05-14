const ChartSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-white shadow-md rounded-lg p-4 h-64">
        <h4 className="font-semibold mb-2">Sales Analytics</h4>
        {/* Replace with real chart */}
        <div className="h-full flex justify-center items-center text-gray-400">Chart Here</div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 h-64">
        <h4 className="font-semibold mb-2">Category Wise Product's Count</h4>
        <div className="h-full flex justify-center items-center text-gray-400">No data</div>
      </div>
    </div>
  );
  
  export default ChartSection;
  
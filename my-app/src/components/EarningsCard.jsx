const EarningsCard = ({ label, amount }) => (
    <div className="flex-1 min-w-[200px] bg-white shadow rounded-lg p-4 text-center">
      <h4 className="text-blue-600 font-semibold">{label}</h4>
      <p className="text-2xl font-bold">₹{amount}</p>
    </div>
  );
  
  export default EarningsCard;
  
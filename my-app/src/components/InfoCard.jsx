import { FaShoppingCart, FaUserPlus, FaMotorcycle, FaHamburger } from 'react-icons/fa';

const icons = {
  orders: <FaShoppingCart className="text-4xl" />,
  signups: <FaUserPlus className="text-4xl" />,
  riders: <FaMotorcycle className="text-4xl" />,
  branches: <FaHamburger className="text-4xl" />,
};

const InfoCard = ({ title, value, type, color }) => {
  return (
    <div className="flex-1 min-w-[220px] bg-white shadow-md rounded-lg p-4 border">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full text-white ${color}`}>
          {icons[type]}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-gray-600">{title}</p>
          <a href="#" className="text-blue-500 text-sm">More info →</a>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;

import { Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaShoppingCart, FaTags, FaCodeBranch, FaCubes, FaPhotoVideo,
  FaCashRegister, FaSlidersH, FaGift, FaTicketAlt, FaPercentage, FaBoxes,
  FaUser, FaMotorcycle, FaMoneyBill, FaPaperPlane, FaTools, FaGlobe, FaMapMarkerAlt, FaSignOutAlt, FaMapMarkedAlt, FaPlus, FaUpload, FaList
} from 'react-icons/fa';
import Logo from '../../assets/logo.jpg'; // Your logo file
import { useState } from 'react';

const Asidebar = ({ isOpen, onLogout }) => {
  const [productsOpen, setProductsOpen] = useState(false);
  const [supportTicketsOpen, setSupportTicketsOpen] = useState(false);

  return (
    <div className={`fixed top-0 left-0 h-screen bg-[#011950] text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 overflow-y-auto`}>
      
      {/* Logo */}
      <div className="p-4 flex flex-col items-center justify-center w-full">
        <img src={Logo} alt="Logo" className="w-16 h-16 object-cover rounded-lg shadow-md" />
        <span className="mt-2 font-semibold text-lg">Gavathi Party</span>
      </div>

      <hr className="border-gray-600 my-2" />

      {/* Sidebar Menu */}
      <ul className="space-y-1 px-2 text-sm">
        <SidebarItem to="/admin/dashboard" label="Dashboard" icon={<FaTachometerAlt />} />
        <SidebarItem to="/admin/orders" label="Orders" icon={<FaShoppingCart />} />
        <SidebarItem to="/admin/categories" label="Categories" icon={<FaTags />} />
        <SidebarItem to="/admin/tags" label="Tags" icon={<FaTags />} />
        <SidebarItem to="/admin/branch" label="Branch" icon={<FaCodeBranch />} />
        <li className="group">
          <div className="flex items-center justify-between gap-3 p-3 hover:bg-gray-700 rounded cursor-pointer transition" onClick={() => setProductsOpen(!productsOpen)}>
            <div className="flex items-center gap-3">
              <FaCubes />
              <span>Products</span>
            </div>
            <span>{productsOpen ? '▼' : '▶'}</span>
          </div>
          {productsOpen && (
            <ul className="ml-6 mt-1 space-y-1">
              <SidebarItem to="/admin/products/attributes" label="Attributes" icon={<FaSlidersH />} />
              <SidebarItem to="/admin/products/tax" label="Tax" icon={<FaPercentage />} />
              <SidebarItem to="/admin/products/add" label="Add Products" icon={<FaPlus />} />
              <SidebarItem to="/admin/products/bulk-upload" label="Bulk Upload" icon={<FaUpload />} />
              <SidebarItem to="/admin/products/manage-products" label="Manage Products" icon={<FaBoxes />} />
              <SidebarItem to="/admin/products/orders" label="Products Order" icon={<FaList />} />
            </ul>
          )}
        </li>
        <SidebarItem to="/admin/media" label="Media" icon={<FaPhotoVideo />} />
        <SidebarItem to="/admin/pos" label="Point of sale" icon={<FaCashRegister />} />
        <SidebarItem to="/admin/sliders" label="Sliders" icon={<FaSlidersH />} />
        <SidebarItem to="/admin/offers" label="Offers" icon={<FaGift />} />
        <li className="group">
          <div
            className="flex items-center justify-between gap-3 p-3 hover:bg-gray-700 rounded cursor-pointer transition"
            onClick={() => setSupportTicketsOpen(!supportTicketsOpen)}
          >
            <div className="flex items-center gap-3">
              <FaTicketAlt />
              <span>Support Tickets</span>
            </div>
            <span>{supportTicketsOpen ? '▼' : '▶'}</span>
          </div>
          {supportTicketsOpen && (
            <ul className="ml-6 mt-1 space-y-1">
              <SidebarItem to="/admin/support/ticket-types" label="Ticket Types" icon={<FaList />} />
              <SidebarItem to="/admin/support/tickets" label="Tickets" icon={<FaTicketAlt />} />
            </ul>
          )}
        </li>
        <SidebarItem to="/admin/promo" label="Promo code" icon={<FaPercentage />} />
        <SidebarItem to="/admin/featured" label="Featured Sections" icon={<FaBoxes />} />
        <SidebarItem to="/admin/customers" label="Customer" icon={<FaUser />} />
        <SidebarItem to="/admin/riders" label="Riders" icon={<FaMotorcycle />} />
        <SidebarItem to="/admin/payment-request" label="Payment Request" icon={<FaMoneyBill />} />
        <SidebarItem to="/admin/notifications" label="Send Notification" icon={<FaPaperPlane />} />
        <SidebarItem to="/admin/system" label="System" icon={<FaTools />} />
        <SidebarItem to="/admin/settings" label="Web Settings" icon={<FaGlobe />} />
        <SidebarItem to="/admin/locations" label="Locations" icon={<FaMapMarkerAlt />} />
       
        <li>
          <button onClick={onLogout} className="w-full text-left flex items-center gap-3 p-3 mt-2 hover:bg-red-600 rounded transition">
            <FaSignOutAlt />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

const SidebarItem = ({ to, label, icon }) => (
  <li>
    <Link to={to} className="flex items-center gap-3 p-3 rounded hover:bg-blue-800 transition">
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

export default Asidebar;

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";

const links = [
  {
    name: "New Quote",
    to: "/new-quote",
  },
  {
    name: "Bulk Upload",
    to: "/bulk-upload",
  },
  {
    name: "History",
    to: "/history",
  },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `text-black px-4 py-2 transition-all duration-200 font-bold ${
        isActive ? "border-b-4 border-black" : "border-transparent border-b-4 hover:border-gray-300"
    }`;

  

  const mobileLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `block w-full px-6 py-4 text-xl font-bold border-b border-black ${
      isActive ? "text-black bg-gray-200" : "text-black"
    }`;

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-black text-2xl font-black tracking-tighter uppercase">
            LMS <span className="text-black font-light">Quotation System</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <NavLink key={link.name} to={link.to} className={navLinkStyles}>
              {link.name.toUpperCase()}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-black focus:outline-none p-2"
        >
          {isOpen ? (
            <X size={30} className="text-black" strokeWidth={3} />
          ) : (
            <Menu size={30} className="text-black" strokeWidth={3} />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-black">
          <nav className="flex flex-col">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={mobileLinkStyles}
              >
                {link.name.toUpperCase()}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
import useWindowSize from "@components/utils/windowSize/windowSize";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const Nav = ({ navItem, auth }) => {
  const router = useRouter();
  const [sub, setSub] = useState(false);
  const [height, width] = useWindowSize();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    if (height > 768) {
      setSub(false);
    }
  }, [height]);

  // Helper function to check if nav item should be visible
  const shouldShowNavItem = (item) => {
    if (item.guestOnly && auth) return false; // Hide guest-only items when logged in
    if (item.auth && !auth) return false; // Hide auth-required items when not logged in
    return true;
  };

  return (
    <nav className="header-nav">
      <ul className="header-nav-list">
        {navItem.map((item, index) => (
          <li
            key={index}
            className={`header-nav-item ${item.submenu ? "has-child" : ""}`}
            onMouseEnter={() => setActiveSubmenu(index)}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            {item.submenu ? (
              <>
                <span className="nav-link">
                  {item.title}
                  <i className="icon-arrow-down"></i>
                </span>
                {activeSubmenu === index && (
                  <ul className="submenu">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link href={subItem.path}>{subItem.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link href={item.path}>{item.title}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

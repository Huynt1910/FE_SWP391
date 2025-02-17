import useWindowSize from "@components/utils/windowSize/windowSize";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const Nav = ({ navItem, auth }) => {
  const router = useRouter();
  const [sub, setSub] = useState(false);
  const [height, width] = useWindowSize();

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
    <ul className="header-nav">
      {navItem.map((nav) =>
        shouldShowNavItem(nav) ? (
          <li
            key={nav.path}
            onClick={() => {
              nav.subNav ? setSub(!sub) : "";
            }}
          >
            <Link
              href={nav.path}
              className={nav.path === router.pathname ? "active" : ""}
            >
              {nav.name}
            </Link>
            {nav.subNav && (
              <ul className={sub ? "active" : ""}>
                {nav.subNav.filter(shouldShowNavItem).map((sub) => (
                  <li key={sub.path}>
                    <Link href={sub.path} legacyBehavior>
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ) : null
      )}
    </ul>
  );
};

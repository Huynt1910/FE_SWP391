import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import useWindowSize from "@components/utils/windowSize/windowSize";
import { header, navItem } from "@data/data.header";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Nav } from "./Nav/Nav";
import { useSelf } from "@store/self.store";
import { deleteCookie } from "cookies-next";
import useCart from "../../../context/CartContext";

export const Header = () => {
  let cartData = { cart: [], cartCount: 0 };
  try {
    cartData = useCart() || { cart: [], cartCount: 0 };
  } catch (error) {
    console.error("Error using cart context:", error);
  }
  
  const { cart, cartCount } = cartData;
  const [promo, setPromo] = useState(true);
  const [fixedNav, setFixedNav] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [height, width] = useWindowSize();
  const { self } = useSelf();
  // For Fixed nav
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });

  const logOut = async () => {
    deleteCookie("token");
    deleteCookie("userRole");
    deleteCookie("userId");
    window.location.reload();
    
  };

  const isSticky = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 10) {
      setFixedNav(true);
    } else {
      setFixedNav(false);
    }
  };

  useEffect(() => {
    if (openMenu) {
      if (height < 767) {
        disableBodyScroll(document);
      } else {
        enableBodyScroll(document);
      }
    } else {
      enableBodyScroll(document);
    }
  }, [openMenu, height]);

  const headerOptions = [
    // { path: "/faq", icon: "icon-search", auth: false },
    { path: "/profile", icon: "icon-user", auth: true },
    // { path: "/wishlist", icon: "icon-heart", auth: true },
    // {
    //   path: "/cart",
    //   icon: "icon-cart",
    //   auth: true,
    //   badge: cartCount || "0",
    // },
    { icon: "icon-logout", auth: true, isLogout: true },
    { icon: "icon-login", auth: true, isLogin: true },
  ];

  const filteredOptions = headerOptions.filter((option) => {
    return !option.auth || (option.auth && self);
  });

  return (
    <>
      {/* <!-- BEGIN HEADER --> */}
      <header className="header">
        {promo && (
          <div className="header-top">
            <span>30% OFF ON ALL SERVICES ENTER CODE: BAMBOSHOP2025</span>
            <i
              onClick={() => setPromo(false)}
              className="header-top-close js-header-top-close icon-close"
            ></i>
          </div>
        )}
        <div className={`header-content ${fixedNav ? "fixed" : ""}`}>
          {/* Logo */}
          <div className="header-logo">
            <Link href="/">
              <img src={header.logo} alt="" />
            </Link>
          </div>

          {/* Nav */}
          <div style={{ right: openMenu ? 0 : -360 }} className="header-box">
            <Nav navItem={navItem} auth={self} />

            {/* header options */}
            <ul className="header-options">
              {filteredOptions.map((option, index) => {
                return (
                  <li key={index}>
                    {option.isLogout ? (
                      <button className="signout-btn" onClick={logOut}>
                        Logout
                      </button>
                    ) : (
                      option?.path && (
                        <Link href={option.path}>
                          <i className={option.icon}></i>
                          {option.badge && <span>{option.badge}</span>}
                        </Link>
                      )
                    )}
                  </li>
                );
              })}
              {!self && (
                <div className="login-btn">
                  <Link href="/login" className="login-btn">
                    Login
                  </Link>
                </div>
              )}
            </ul>
          </div>

          <div
            onClick={() => setOpenMenu(!openMenu)}
            className={
              openMenu ? "btn-menu js-btn-menu active" : "btn-menu js-btn-menu"
            }
          >
            {[1, 2, 3].map((i) => (
              <span key={i}>&nbsp;</span>
            ))}
          </div>
        </div>
      </header>

      {/* <!-- HEADER EOF   --> */}
    </>
  );
};

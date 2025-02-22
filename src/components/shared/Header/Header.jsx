import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import useWindowSize from "@components/utils/windowSize/windowSize";
import { header, navItem } from "@data/data.header";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Nav } from "./Nav/Nav";
import { useSelf } from "@store/self.store";
import { deleteCookie } from "cookies-next";
import { CartContext } from "@/pages/_app";

export const Header = () => {
  const { cart } = useContext(CartContext);
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
    deleteCookie("access_token");
    deleteCookie("refresh_token");
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
    { path: "/faq", icon: "icon-search", auth: false },
    { path: "/profile", icon: "icon-user", auth: false },
    { path: "/wishlist", icon: "icon-heart", auth: false },
    {
      path: "/cart",
      icon: "icon-cart",
      auth: false,
      badge: cart.length ?? "0",
    },
    { icon: "icon-logout", auth: true, isLogout: true },
    { icon: "icon-login", auth: true, isLogin: true },
  ];

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
          <div className="header-logo">
            <Link href="/">
              <img src={header.logo} alt="" />
            </Link>
          </div>
          <div style={{ right: openMenu ? 0 : -360 }} className="header-box">
            {/* Nav */}
            <Nav navItem={navItem} auth={self} />
            {/* header options */}
            <ul className="header-options">
              {headerOptions
                .filter((option) => !option.auth || (option.auth && self))
                .map((option, index) => (
                  <li key={index}>
                    {option.isLogout ? (
                      <button className="sign-out-btn" onClick={logOut}>
                        Signout
                      </button>
                    ) : (
                      <Link href={option.path}>
                        <i className={option.icon}></i>
                        {option.badge && <span>{option.badge}</span>}
                      </Link>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          {!self && (
            <div className="header-login">
              <Link href="/login" className="login-btn">
                Login
              </Link>
            </div>
          )}

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

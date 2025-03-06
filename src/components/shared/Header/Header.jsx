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
    deleteCookie("token");
<<<<<<< HEAD
    deleteCookie("token");
=======
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
    { path: "/profile", icon: "icon-user", auth: true },
    { path: "/wishlist", icon: "icon-heart", auth: true },
    {
      path: "/cart",
      icon: "icon-cart",
      auth: true,
      badge: cart.length ?? "0",
    },
    { icon: "icon-logout", auth: true, isLogout: true },
    { icon: "icon-login", auth: true, isLogin: true },
  ];

<<<<<<< HEAD
=======
  const filteredOptions = headerOptions.filter((option) => {
    return !option.auth || (option.auth && self);
  });

>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
<<<<<<< HEAD
              {headerOptions
                .filter((option) => !option.auth || (option.auth && self))
                .map((option, index) => (
=======
              {filteredOptions.map((option, index) => {
                return (
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
                  <li key={index}>
                    {option.isLogout ? (
                      <button className="signout-btn" onClick={logOut}>
                        Signout
                      </button>
                    ) : (
<<<<<<< HEAD
                      <Link href={option.path}>
                        <i className={option.icon}></i>
                        {option.badge && <span>{option.badge}</span>}
                      </Link>
                    )}
                  </li>
                ))}
=======
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
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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

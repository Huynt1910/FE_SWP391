export const header = {
  logo: "/assets/img/header-logo.svg",
};

export const navItem = [
  {
    title: "Home",
    path: "/",
    auth: false,
  },
  {
    title: "Service",
    path: "/shop",
    auth: false,
  },
  {
    title: "Categories",
    path: "/categories",
    auth: false,
  },
  {
    title: "Information",
    path: "#",
    auth: false,
    submenu: [
      {
        title: "About Us",
        path: "/about",
        auth: false,
      },
      {
        title: "Blog",
        path: "/blog",
        auth: false,
      },
      {
        title: "FAQ",
        path: "/faq",
        auth: false,
      },
      {
        title: "Contact",
        path: "/contact",
        auth: false,
      },
    ],
  },
];

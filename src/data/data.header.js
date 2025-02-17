export const header = {
  logo: "/assets/img/header-logo.svg",
};

export const navItem = [
  {
    name: "Home",
    path: "/",
    auth: false,
  },
  {
    name: "pages",
    path: "#",
    auth: false,
    subNav: [
      {
        name: "About us",
        path: "/about",
        auth: false,
      },
      {
        name: "FAQ",
        path: "/faq",
        auth: false,
      },
      {
        name: "My Profile",
        path: "/profile",
        auth: true,
      },
      {
        name: "Login",
        path: "/login",
        auth: false,
        guestOnly: true,
      },
      {
        name: "Registration",
        path: "/registration",
        auth: false,
        guestOnly: true,
      },
      {
        name: "Product",
        path: "/product",
        auth: false,
      },
      {
        name: "Post",
        path: "/blog/2633",
        auth: false,
      },
      {
        name: "Checkout",
        path: "/checkout",
        auth: true,
      },
      {
        name: "404",
        path: "/404",
        auth: false,
      },
      {
        name: "Cart",
        path: "/cart",
        auth: true,
      },
      {
        name: "Wishlist",
        path: "/wishlist",
        auth: true,
      },
    ],
  },
  {
    name: "shop",
    path: "/shop",
    auth: false,
  },
  {
    name: "Categories",
    path: "/categories",
    auth: false,
  },
  {
    name: "blog",
    path: "/blog",
    auth: false,
  },
  {
    name: "contact",
    path: "/contact",
    auth: false,
  },
];

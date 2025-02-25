import React from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
} from "@mui/material";
import {
  Dashboard,
  People,
  ShoppingCart,
  ListAlt,
  Settings,
} from "@mui/icons-material";
import styles from "./AdminLayout.module.scss";

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin" },
    { text: "Quản lý người dùng", icon: <People />, path: "/admin/users" },
    {
      text: "Quản lý sản phẩm",
      icon: <ShoppingCart />,
      path: "/admin/products",
    },
    { text: "Quản lý đơn hàng", icon: <ListAlt />, path: "/admin/orders" },
    { text: "Cài đặt", icon: <Settings />, path: "/admin/settings" },
  ];

  return (
    <div className={styles.adminLayout}>
      <CssBaseline />
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={styles.drawer}
        classes={{
          paper: styles.drawerPaper,
        }}
      >
        <div className={styles.toolbar} />
        <List>
          {menuItems.map((item, index) => (
            <Link href={item.path} key={index} passHref>
              <ListItem button component="a">
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <main className={styles.content}>
        <div className={styles.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

// import React, { useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/authSlice";
// import { Layout, Menu, Avatar, Dropdown, Button, Typography } from "antd";
// import { 
//   UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, 
//   HomeOutlined, UserAddOutlined 
// } from "@ant-design/icons";
// import "bootstrap/dist/css/bootstrap.min.css";

// const { Header, Sider, Content } = Layout;
// const { Text } = Typography;

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { username } = useSelector((state) => state.auth);
//   const [collapsed, setCollapsed] = useState(false);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   const menu = (
//     <Menu>
//       <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
//         Logout
//       </Menu.Item>
//     </Menu>
//   );

//   return (
//     <Layout style={{ minHeight: "100vh", width: "100vw", display: "flex" }}>
//       {/* Sidebar */}
//       <Sider 
//         collapsible 
//         collapsed={collapsed} 
//         onCollapse={setCollapsed} 
//         theme="dark"
//         width={250}
//         style={{ height: "100vh", position: "relative" }} // No fixed positioning
//       >
//         <div className="logo text-center py-3 text-white fw-bold">My Dashboard</div>
//         <Menu theme="dark" mode="inline">
//           <Menu.Item key="home" icon={<HomeOutlined />}>
//             <Link to="/dashboard/home">Home</Link>
//           </Menu.Item>
//           <Menu.Item key="create-agent" icon={<UserAddOutlined />}>
//             <Link to="/dashboard/create-agent">Create Agent</Link>
//           </Menu.Item>
//         </Menu>
//       </Sider>

//       {/* Main Layout */}
//       <Layout style={{ flex: 1, minWidth: 0 }}> 
//         {/* Top Bar */}
//         <Header className="d-flex justify-content-between align-items-center px-3 bg-light shadow">
//           <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
//           <Dropdown overlay={menu} trigger={["click"]}>
//             <div className="d-flex align-items-center">
//               <Avatar icon={<UserOutlined />} className="me-2" />
//               <Text>{username}</Text>
//             </div>
//           </Dropdown>
//         </Header>

//         {/* Page Content */}
//         <Content style={{ padding: "20px", background: "#f0f2f5", flex: 1 }}>
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Layout, Menu, Avatar, Dropdown, Button, Typography, Drawer } from "antd";
import {
  UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  HomeOutlined, UserAddOutlined
} from "@ant-design/icons";

import { TransactionOutlined, TeamOutlined, TagsOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../components/Logo";
import { Modal } from "antd";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        dispatch(logout());
        navigate("/");
      },
    });
  };


  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const sideMenuStyle = { textDecorationLine: "none" }

  const SidebarMenu = (
    <Menu theme="dark" mode="inline" className="h-100">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/dashboard/home" style={sideMenuStyle}>Home</Link>
      </Menu.Item>
      <Menu.Item key="create-agent" icon={<UserAddOutlined />}>
        <Link to="/dashboard/create-agent" style={sideMenuStyle}>Create Agent</Link>
      </Menu.Item>
      <Menu.Item key="transactions" icon={<TransactionOutlined />}>
        <Link to="/dashboard/transactions" style={sideMenuStyle}>Transactions</Link>
      </Menu.Item>
      <Menu.Item key="manage-agents" icon={<TeamOutlined />}>
        <Link to="/dashboard/manage-agents" style={sideMenuStyle}>Manage Agents</Link>
      </Menu.Item>
      <Menu.Item key="tickets" icon={<TagsOutlined />}>
        <Link to="/dashboard/tickets" style={sideMenuStyle}>Tickets</Link>
      </Menu.Item>
      {/* <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        <Link to="/logout" style={sideMenuStyle}>Logout</Link>
      </Menu.Item> */}
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={() => { console.log("Event Fired");handleLogout(); }}>
        Logout
      </Menu.Item>
    </Menu>
  );


  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }} className="w-100 h-100">
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark" width={250}>

          <div className="w-100 d-flex justify-content-center mt-3">
            <Logo wid={80} />
          </div>
          <div className="logo text-center py-3 text-white fw-bold">My Dashboard</div>
          {SidebarMenu}
        </Sider>
      )}

      {/* Sidebar Drawer for Mobile */}
      {isMobile && (
        <Drawer
          title="My Dashboard"
          placement="left"
          closable
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          {SidebarMenu}
        </Drawer>
      )}

      {/* Main Layout background: "#f0f2f5", */}
      <Layout style={{ flex: 1, minWidth: 0 }} className="bg-success h-100">
        {/* Top Bar */}
        <div className="w-100 h-100 d-flex flex-column">
          <Header className="d-flex justify-content-between align-items-center px-3 bg-light shadow">
            <Button
              type="text"
              icon={isMobile ? <MenuUnfoldOutlined /> : collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => isMobile ? setDrawerVisible(true) : setCollapsed(!collapsed)}
            />
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="d-flex align-items-center">
                <Avatar icon={<UserOutlined />} className="me-2" />
                <Text>{username}</Text>
              </div>
            </Dropdown>
          </Header>

          {/* Page Content */}
          <Content style={{ padding: "20px", flex: 1, background: "#f0f2f5", overflow: "auto" }}>
            <Outlet />
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};

export default Dashboard;




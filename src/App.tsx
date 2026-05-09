import { Flex, Layout, Menu, Typography } from "antd";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import ThemeToggle from "./components/ThemeToggle";
import { LAYOUT_MAX_WIDTH } from "@/constant/constant";

const { Header, Content } = Layout;

const menuItems = [
  { key: "/dashboard", label: <Link to="/dashboard">Dashboard</Link> },
  { key: "/tasks", label: <Link to="/tasks">Tasks</Link> },
];

export default function App() {
  const location = useLocation();
  const selected =
    menuItems.find((m) => location.pathname.startsWith(m.key))?.key ??
    "/dashboard";

  return (
    <Layout className="min-h-screen">
      <Header className="!px-6">
        <Flex align="center" gap="large" className="h-full">
          <Typography.Title level={4} style={{ color: "white", margin: 0 }}>
            TaskBoard
          </Typography.Title>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selected]}
            items={menuItems}
            className="flex-1 !bg-transparent !border-0"
          />
          <ThemeToggle />
        </Flex>
      </Header>
      <Content
        className="p-4 md:p-6 lg:p-8"
        style={{ maxWidth: LAYOUT_MAX_WIDTH, width: "100%", margin: "0 auto" }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
}

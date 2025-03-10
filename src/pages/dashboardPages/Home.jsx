import React from "react";
import { Card, Statistic, Table } from "antd";
import { Bar, Line } from "react-chartjs-2";
import { UserOutlined, TagsOutlined, DollarOutlined } from "@ant-design/icons";
import Chart from "chart.js/auto";

const Home = () => {
    // Dummy Data for Analytics
    const summaryData = [
        { title: "Total Agents", value: 124, icon: <UserOutlined />, color: "#1890ff" },
        { title: "Tickets Sold Today", value: 87, icon: <TagsOutlined />, color: "#52c41a" },
        { title: "Total Revenue", value: "₦12,450", icon: <DollarOutlined />, color: "#faad14" },
    ];

    // Chart Data
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                label: "Revenue",
                data: [5000, 6000, 7500, 8200, 9100, 10500, 12450],
                backgroundColor: "rgba(24, 144, 255, 0.5)",
                borderColor: "#1890ff",
                borderWidth: 2,
            },
            {
                label: "Tickets Sold",
                data: [50, 65, 75, 80, 95, 100, 120],
                backgroundColor: "rgba(82, 196, 26, 0.5)",
                borderColor: "#52c41a",
                borderWidth: 2,
            },
        ],
    };

    // Table Columns
    const columns = [
        { title: "Transaction ID", dataIndex: "id", key: "id" },
        { title: "Agent", dataIndex: "agent", key: "agent" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
        { title: "Status", dataIndex: "status", key: "status" },
    ];

    // Dummy Transactions Data
    const transactions = [
        { id: "TXN123", agent: "Obateru Anthony", amount: "₦500", status: "Completed" },
        { id: "TXN124", agent: "Tolulope Ayeni", amount: "₦750", status: "Pending" },
        { id: "TXN125", agent: "Tolulope Ayeni", amount: "₦1,200", status: "Completed" },
    ];

    return (
        <div style={{ padding: "20px" }}>
            {/* Summary Cards */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }} className="flex-wrap justify-content-center">
                {summaryData.map((item, index) => (
                    <Card
                        key={index}
                        style={{
                            width: "300px",
                            backgroundColor: item.color,
                            color: "#fff",
                            borderRadius: "10px",
                        }}
                    >
                        <Statistic
                            title={item.title}
                            value={item.value}
                            valueStyle={{ color: "#fff" }}
                            prefix={item.icon}
                        />
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }} className="flex-wrap row m-0">
                <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "10px" }} className="col-md-6">
                    <h3>Revenue & Tickets Sold</h3>
                    <div className="w-100 overflow-auto">
                        <Bar data={chartData} />
                    </div>
                </div>
                <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "10px" }} className="col-md-6">
                    <h3>Monthly Trends</h3>
                    <div className="w-100 overflow-auto">
                        <Line data={chartData} />
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }} className="mt-3">
                <h3>Recent Transactions</h3>
                <div className="w-100 overflow-auto">
                    <Table columns={columns} dataSource={transactions} rowKey="id" />
                </div>
            </div>
        </div>
    );
};

export default Home;

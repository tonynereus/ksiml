import React, { useState, useEffect } from "react";
import { Card, message, Statistic, Table, Skeleton, Select } from "antd";
import { Bar, Line } from "react-chartjs-2";
import { UserOutlined, TagsOutlined, DollarOutlined } from "@ant-design/icons";
import Chart from "chart.js/auto";
import apis from "../../utils/apis";
import { fetchWithAuth } from "../../redux/store";
const { Option } = Select;

const Home = () => {

    const [appData, setAppData] = useState();
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("day");

    const fetchOverview = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(apis.overview + "?filter=" + filter, "GET");
            if (res.status) {
                //setTimeout(()=>{ setAppData(res.data)},5000);
                setAppData(res.data)
            } else {
                message.error(res.message || "Failed to fetch overview");
            }
        } catch (err) {
            message.error("Error fetching overview");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOverview();
    }, [filter]);


    // Chart Data
    // const chartData = {
    //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    //     datasets: [
    //         {
    //             label: "Revenue",
    //             data: [5000, 6000, 7500, 8200, 9100, 10500, 12450],
    //             backgroundColor: "rgba(24, 144, 255, 0.5)",
    //             borderColor: "#1890ff",
    //             borderWidth: 2,
    //         },
    //         {
    //             label: "Tickets Sold",
    //             data: [50, 65, 75, 80, 95, 100, 120],
    //             backgroundColor: "rgba(82, 196, 26, 0.5)",
    //             borderColor: "#52c41a",
    //             borderWidth: 2,
    //         },
    //     ],
    // };

    // Table Columns
    const columns = [
        { title: "Transaction ID", dataIndex: "id", key: "id" },
        { title: "Agent", dataIndex: "agent_name", key: "agent" },
        { title: "Amount", dataIndex: "ticket_price", key: "amount" },
        { title: "Date", dataIndex: "created_at", key: "date", render: (itm) => new Date(itm).toLocaleDateString() },
        { title: "Time", dataIndex: "created_at", key: "time", render: (itm) => new Date(itm).toLocaleTimeString() },
    ];

    // Dummy Transactions Data
    return (
        <>
            <div style={{ padding: "20px" }}>
                {
                    loading ? <>
                        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }} className="flex-wrap justify-content-center">
                            <Skeleton.Button active style={{ width: 300, height: 120, borderRadius: 10 }} />
                            <Skeleton.Button active style={{ width: 300, height: 120, borderRadius: 10 }} />
                            <Skeleton.Button active style={{ width: 300, height: 120, borderRadius: 10 }} />
                        </div>

                        {/* Skeleton for Table */}
                        <Skeleton active title paragraph={{ rows: 6 }} />
                    </>
                        :
                        <>
                            <div className="d-flex justify-content-end">
                                <Select
                                    placeholder="Filter by"
                                    style={{ width: 200, marginBottom: "15px" }}
                                    value={filter}
                                    onChange={(value) => setFilter(value)}
                                >
                                    <Option value="all">All</Option>
                                    <Option value="day">Today</Option>
                                    <Option value="week">This Week</Option>
                                    <Option value="month">This Month</Option>
                                </Select>
                            </div>
                            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }} className="flex-wrap justify-content-center">
                                <Card
                                    style={{
                                        width: "300px",
                                        backgroundColor: "#1890ff",
                                        color: "#fff",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <Statistic
                                        title={"Total Agents"}
                                        value={appData?.total_agents ?? "-"}
                                        valueStyle={{ color: "#fff" }}
                                        prefix={<UserOutlined />}
                                    />
                                </Card>
                                <Card
                                    style={{
                                        width: "300px",
                                        backgroundColor: "#52c41a",
                                        color: "#fff",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <Statistic
                                        title={`${filter == "all" ? "Total" : ''} Tickets Sold ${filter == "day" ? "Today" : ''} ${filter == "week" ? "This Week" : ""} ${filter == "month" ? "This Month" : ""}`}
                                        value={appData?.tickets_sold ?? "-"}
                                        valueStyle={{ color: "#fff" }}
                                        prefix={<TagsOutlined />}
                                    />
                                </Card>
                                <Card
                                    style={{
                                        width: "300px",
                                        backgroundColor: "#faad14",
                                        color: "#fff",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <Statistic
                                        title={"Total Revenue"}
                                        value={"₦" + (appData?.total_revenue ?? "-")}
                                        valueStyle={{ color: "#fff" }}
                                        prefix={<DollarOutlined />}
                                    />

                                    {/* Custom content below Statistic */}
                                    <div style={{ marginTop: 12 }} className="d-flex justify-content-between">
                                        <strong><div style={{ color: "#fff" }}>Office: {"₦" + (appData?.office_share ?? "-")}</div></strong>
                                        <strong><div style={{ color: "#fff" }}>Agent: {"₦" + (appData?.agent_share ?? "-")}</div></strong>
                                    </div>
                                </Card>

                            </div>

                            {/* Charts Section */}
                            <div style={{ display: "none", gap: "20px", marginBottom: "20px" }} className="flex-wrap row m-0">
                                <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "10px" }} className="col-md-6">
                                    <h3>Revenue & Tickets Sold</h3>
                                    <div className="w-100 overflow-auto">
                                        {/* <Bar data={chartData} /> */}
                                    </div>
                                </div>
                                <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "10px" }} className="col-md-6">
                                    <h3>Monthly Trends</h3>
                                    <div className="w-100 overflow-auto">
                                        {/* <Line data={chartData} /> */}
                                    </div>
                                </div>
                            </div>

                            {/* Transactions Table */}
                            <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }} className="mt-3">
                                <h3>Recent Transactions</h3>
                                <div className="w-100 overflow-auto">
                                    <Table columns={columns} dataSource={appData?.recent_transactions ?? []} rowKey="id" />
                                </div>
                            </div>
                        </>
                }
            </div>
        </>
    );
};

export default Home;

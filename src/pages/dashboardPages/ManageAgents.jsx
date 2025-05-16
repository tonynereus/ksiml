import React, { useEffect, useState } from "react";
import { Card, Button, Avatar, Spin, message, Modal, InputNumber, Typography, Select, Statistic, Table, Row, Col, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "../../redux/store";
import apis from "../../utils/apis";

const { Option } = Select;

const { Title, Text } = Typography;

const ManageAgents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [updatingBalance, setUpdatingBalance] = useState(false);
    const [reload, setReload] = useState(false);
    const triggerReload = () => { setReload(!reload) };
    const [suspendLoading, setSuspendLoading] = useState(false);
    const [unsuspendLoading, setUnsuspendLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // In your ManageAgents component (same file)

    const [summaryModalVisible, setSummaryModalVisible] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryFilter, setSummaryFilter] = useState("day");

    const openSummaryModal = async (agent) => {
        setSummaryModalVisible(true);
        setSelectedAgent(agent);
        fetchAgentSummary(agent.id, summaryFilter);
    };

    const fetchAgentSummary = async (agentId, filter) => {
        setSummaryLoading(true);
        try {
            const res = await fetchWithAuth(`${apis.agentSummary}/${agentId}?filter=${filter}`, "GET");
            if (res.status) {
                setSummaryData(res.data);
            } else {
                message.error(res.message || "Failed to load agent summary");
            }
        } catch (err) {
            message.error("Error fetching agent summary");
        } finally {
            setSummaryLoading(false);
        }
    };


    const fetchAgents = async () => {
        try {
            const res = await fetchWithAuth(apis.getAgents, "GET");
            if (res.status) {
                setAgents(res.data.agents);
            } else {
                message.error(res.message || "Failed to fetch agents");
            }
        } catch (err) {
            message.error("Error fetching agents");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAgents();
    }, [reload]);
    const openModal = (agent) => {
        setSelectedAgent(agent);
        setWalletBalance(agent.wallet_balance);
        setModalVisible(true);
    };

    const handleSuspend = async () => {
        setSuspendLoading(true);
        try {
            const res = await fetchWithAuth(apis.suspendAgent + selectedAgent.id, "PUT");
            if (res.status) {
                message.success(res.message);
                triggerReload();
                setModalVisible(false)
            } else {
                message.error(res.message || "Failed to suspend agent");
            }
        } catch (err) {
            message.error("Error suspending agent");
        } finally {
            setSuspendLoading(false);
        }
    };

    const handleUnSuspend = async () => {
        setUnsuspendLoading(true);
        try {
            const res = await fetchWithAuth(apis.activateAgent + selectedAgent.id, "PUT");
            if (res.status) {
                message.success(res.message);
                triggerReload();
                setModalVisible(false)
            } else {
                message.error(res.message || "Failed to unsuspend agent");
            }
        } catch (err) {
            message.error("Error unsuspending agent");
        } finally {
            setUnsuspendLoading(false);
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: "Are you sure you want to delete this agent?",
            content: (
                <div>
                    <p>
                        Deleting this agent will permanently remove all transactions recorded by them.
                    </p>
                    <p style={{ color: "red", fontWeight: 500 }}>
                        This action cannot be undone.
                    </p>
                    <p>
                        It is advised to suspend the agent instead if you just want to restrict access.
                    </p>
                </div>
            ),
            okText: "Delete Anyway",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                setDeleteLoading(true);
                try {
                    const res = await fetchWithAuth(apis.deleteAgent + selectedAgent.id, "DELETE");
                    if (res.status) {
                        message.success(res.message);
                        triggerReload();
                        setModalVisible(false);
                    } else {
                        message.error(res.message || "Failed to delete agent");
                    }
                } catch (err) {
                    message.error("Error deleting agent");
                } finally {
                    setDeleteLoading(false);
                }
            }
        });
    };


    const handleUpdateWallet = async () => {
        setUpdatingBalance(true);
        try {
            const res = await fetchWithAuth(apis.updateAgentBalance, "POST", {
                agent_id: selectedAgent.id,
                wallet_balance: walletBalance,
            });
            if (res.status) {
                message.success("Wallet balance updated successfully!");
                setAgents((prevAgents) =>
                    prevAgents.map((agent) =>
                        agent.id === selectedAgent.id ? { ...agent, wallet_balance: walletBalance } : agent
                    )
                );
                setModalVisible(false)
            } else {
                message.error("Failed to update balance");
            }
        } catch (err) {
            message.error("Error updating balance");
        } finally {
            setUpdatingBalance(false);
        }
    };

    return (
        <div style={{ padding: "30px", textAlign: "center" }}>
            <Title level={3}>Manage Agents</Title>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
                {loading ? (
                    <Spin size="large" />
                ) : (
                    agents.map((agent) => (
                        <Card
                            key={agent.id}
                            style={{ width: 230, borderRadius: 10, textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                        >
                            <Avatar size={64} icon={<UserOutlined />} />
                            <Text style={{ display: "block", fontSize: "14px", fontWeight: 500, marginTop: 8 }}>
                                {agent.username}
                            </Text>
                            <p><strong>Status:</strong> {agent.status === 1 ? <span className="text-success">Active</span> : <span className="text-danger">Suspended</span>}</p>
                            <p style={{ marginBottom: "10px" }}>Wallet: ₦{agent.wallet_balance}</p>
                            <Button type="primary" block onClick={() => openModal(agent)}>
                                Manage
                            </Button>
                            <div className="mt-2">
                                <Text className="text-primary" type="default" block onClick={() => openSummaryModal(agent)} style={{ marginTop: "10px", cursor: "pointer" }}>
                                    View Summary
                                </Text>
                            </div>

                        </Card>
                    ))
                )}
            </div>

            {/* Manage Agent Modal */}
            <Modal
                title="Agent Details"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                {selectedAgent && (
                    <>
                        <p><strong>Username:</strong> {selectedAgent.username}</p>
                        <p><strong>Status:</strong> {selectedAgent.status === 1 ? <span className="text-success">Active</span> : <span className="text-danger">Suspended</span>}</p>
                        <p><strong>Wallet Balance:</strong> ₦{selectedAgent.wallet_balance}</p>

                        <Text>Update Wallet Balance:</Text>
                        <InputNumber
                            style={{ width: "100%", marginBottom: "10px" }}
                            min={0}
                            value={walletBalance}
                            onChange={setWalletBalance}
                        />
                        <Button type="primary" block loading={updatingBalance} onClick={handleUpdateWallet}>
                            Update Wallet Balance
                        </Button>

                        {
                            selectedAgent.status == 1 && <Button loading={suspendLoading} danger block style={{ marginTop: "10px" }} onClick={handleSuspend}>
                                Suspend Agent
                            </Button>
                        }
                        {
                            selectedAgent.status == 0 && (
                                <Button
                                    type="primary"
                                    block
                                    style={{ marginTop: "10px", backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                                    onClick={handleUnSuspend}
                                    loading={unsuspendLoading}
                                >
                                    Unsuspend Agent
                                </Button>
                            )
                        }


                        <Button type="primary" danger block style={{ marginTop: "10px" }} onClick={handleDelete} loading={deleteLoading}>
                            Delete Agent
                        </Button>
                    </>
                )}
            </Modal>

            <Modal
                title={<><Text strong style={{ fontSize: 22 }}>Agent Summary</Text ><small>( {selectedAgent?.username || ""} )</small></>}
                visible={summaryModalVisible}
                onCancel={() => setSummaryModalVisible(false)}
                footer={null}
                width={750}
            >
                <div style={{ marginBottom: 24 }}>
                    <Select
                        value={summaryFilter}
                        style={{ width: "100%" }}
                        onChange={(val) => {
                            setSummaryFilter(val);
                            fetchAgentSummary(selectedAgent.id, val);
                        }}
                        options={[
                            { label: "Today", value: "day" },
                            { label: "This Week", value: "week" },
                            { label: "This Month", value: "month" },
                            { label: "All Time", value: "all" },
                        ]}
                    />
                </div>

                {summaryLoading ? (
                    <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
                ) : summaryData ? (
                    <>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card bordered style={{ textAlign: "center" }}>
                                    <Statistic title="Tickets Sold" value={summaryData.tickets_sold} />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card bordered style={{ textAlign: "center" }}>
                                    <Statistic
                                        title="Total Revenue"
                                        value={summaryData.total_revenue}
                                        prefix="₦"
                                        valueStyle={{ color: "#3f8600" }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card bordered style={{ textAlign: "center" }}>
                                    <Statistic
                                        title="Office Share"
                                        value={summaryData.office_share}
                                        prefix="₦"
                                        valueStyle={{ color: "#cf1322" }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card bordered style={{ textAlign: "center" }}>
                                    <Statistic
                                        title="Agent Share"
                                        value={summaryData.agent_share}
                                        prefix="₦"
                                        valueStyle={{ color: "#1890ff" }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <div style={{ marginTop: 32 }}>
                            <Text strong style={{ fontSize: 16 }}>Recent Transactions</Text>
                            <Table
                                dataSource={summaryData.recent_transactions}
                                columns={[
                                    { title: "Transaction ID", dataIndex: "id" },
                                    {
                                        title: "Amount",
                                        dataIndex: "ticket_price",
                                        render: (val) => `₦${val}`,
                                    },
                                    {
                                        title: "Date",
                                        dataIndex: "created_at",
                                        render: (itm) => new Date(itm).toLocaleString(),
                                    },
                                ]}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                style={{ marginTop: 12 }}
                            />
                        </div>
                    </>
                ) : (
                    <Empty description="No summary data available" />
                )}
            </Modal>


        </div>
    );
};

export default ManageAgents;

import React, { useEffect, useState } from "react";
import { Card, Button, Avatar, Spin, message, Modal, InputNumber, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "../../redux/store";
import apis from "../../utils/apis";

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

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const res = await fetchWithAuth(apis.deleteAgent + selectedAgent.id, "DELETE");
            if (res.status) {
                message.success(res.message);
                triggerReload();
                setModalVisible(false)
            } else {
                message.error(res.message || "Failed to delete agent");
            }
        } catch (err) {
            message.error("Error deleting agent");
        } finally {
            setDeleteLoading(false);
        }
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
        </div>
    );
};

export default ManageAgents;

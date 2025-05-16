import React, { useEffect, useState } from "react";
import { Card, Button, Modal, InputNumber, Typography, message, Spin } from "antd";
import { TagsFilled } from "@ant-design/icons";

import { fetchWithAuth } from "../../redux/store";
import apis from "../../utils/apis";

const { Title, Text } = Typography;

const ManageTickets = () => {

    const fetchTickets = async () => {
        try {
            const res = await fetchWithAuth(apis.getTickets, "GET");
            if (res.status) {
                setTickets(res.data.tickets);
            } else {
                message.error(res.message || "Failed to fetch agents");
            }
        } catch (err) {
            message.error("Error fetching agents");
        } finally {
            setLoading(false);
        }
    };


    const [reload, setReload] = useState(false);
    const [tickets, setTickets] = useState();

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPrice, setNewPrice] = useState(500);
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchTickets();
    }, [reload]);

    const openModal = (ticket) => {
        setSelectedTicket(ticket);
        setNewPrice(ticket.ticket_price);
        setModalVisible(true);
    };

    const handleUpdatePrice = async () => {
        setUpdating(true);
        try {
            const res = await fetchWithAuth(apis.updateTicketPrice, "POST", {
                ticket_id: selectedTicket.id,
                price: newPrice,
            });

            if (res.status) {
                message.success(res.message || "Ticket price updated successfully!");
                setTickets((prevTickets) =>
                    prevTickets.map((ticket) =>
                        ticket.id == selectedTicket.id ? { ...ticket, ticket_price: newPrice } : ticket
                    )
                );
                setModalVisible(false);
            } else {
                message.error(res.message || "Failed to update ticket price");
            }
        } catch (err) {
            message.error("Error updating ticket price");
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdatePriceText = () => {
        setUpdating(true);
        setTimeout(() => {
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id == selectedTicket.id ? { ...ticket, price: newPrice } : ticket
                )
            );
            message.success("Ticket price updated successfully!");
            setUpdating(false);
            setModalVisible(false);
        }, 1000);
    };

    return (
        <div style={{ padding: "30px", textAlign: "center" }}>
            <Title level={3}>Manage Tickets</Title>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
                {loading &&
                    <Spin size="large" />
                }
                {tickets && tickets.map((ticket) => (
                    <Card
                        key={ticket.id}
                        style={{ width: 230, borderRadius: 10, textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    >
                        <div className="d-flex justify-content-center">
                            <TagsFilled style={{ fontSize: "40px", color: "#1890ff", marginBottom: "10px" }} />
                        </div>
                        <Text strong>{ticket.ticket_name}</Text>
                        <p style={{ marginBottom: "10px" }}>Price: ₦{ticket.ticket_price}</p>
                        <Button type="primary" block onClick={() => openModal(ticket)}>
                            Manage Ticket
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Manage Ticket Modal */}
            <Modal
                title="Manage Ticket"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                {selectedTicket && (
                    <>
                        <p><strong>Ticket:</strong> {selectedTicket.ticket_name}</p>
                        <p><strong>Current Price:</strong> ₦{selectedTicket.ticket_price}</p>

                        <Text>Set New Price:</Text>
                        <InputNumber
                            style={{ width: "100%", marginBottom: "10px" }}
                            min={50}
                            value={newPrice}
                            onChange={setNewPrice}
                        />
                        <Button type="primary" block loading={updating} onClick={handleUpdatePrice}>
                            Update Price
                        </Button>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default ManageTickets;

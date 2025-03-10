import React, { useState } from "react";
import { Card, Button, Modal, InputNumber, Typography, message } from "antd";
import { TagsFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

const ManageTickets = () => {
    const [tickets, setTickets] = useState([
        { id: 1, name: "Motocycle (Urban)", price: 500 },
        { id: 2, name: "Taxi (Cab, Urban)", price: 500 },
        { id: 3, name: "Keke Napep (Tricycle, Urban)", price: 500 }
    ]);

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPrice, setNewPrice] = useState(500);
    const [updating, setUpdating] = useState(false);

    const openModal = (ticket) => {
        setSelectedTicket(ticket);
        setNewPrice(ticket.price);
        setModalVisible(true);
    };

    const handleUpdatePrice = () => {
        setUpdating(true);
        setTimeout(() => {
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id === selectedTicket.id ? { ...ticket, price: newPrice } : ticket
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
                {tickets.map((ticket) => (
                    <Card
                        key={ticket.id}
                        style={{ width: 230, borderRadius: 10, textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    >
                        <div className="d-flex justify-content-center">
                            <TagsFilled style={{ fontSize: "40px", color: "#1890ff", marginBottom: "10px" }} />
                        </div>
                        <Text strong>{ticket.name}</Text>
                        <p style={{ marginBottom: "10px" }}>Price: ₦{ticket.price}</p>
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
                        <p><strong>Ticket:</strong> {selectedTicket.name}</p>
                        <p><strong>Current Price:</strong> ₦{selectedTicket.price}</p>

                        <Text>Set New Price:</Text>
                        <InputNumber
                            style={{ width: "100%", marginBottom: "10px" }}
                            min={100}
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

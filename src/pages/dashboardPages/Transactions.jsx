import { Table, Button, Select, Tag, Modal } from "antd";
import { useState } from "react";

const { Option } = Select;

const Transactions = () => {
    const [selectedAgent, setSelectedAgent] = useState("All");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Dummy transactions data
    const transactions = [
        {
            key: "1",
            transactionId: "TXN123456",
            ticketName: "Motocycle (Urban)",
            agentName: "Tolulope Ayeni",
            date: "2024-03-10 14:30",
            ticketPrice: 500,
            agentPrice: 550
        },
        {
            key: "2",
            transactionId: "TXN789012",
            ticketName: "Taxi (Cab, Urban)",
            agentName: "Obateru Anthony",
            date: "2024-03-09 12:45",
            ticketPrice: 500,
            agentPrice: 500
        },
        {
            key: "3",
            transactionId: "TXN345678",
            ticketName: "Keke Napep (Tricicle, Urban)",
            agentName: "Tolulope Ayeni",
            date: "2024-03-08 10:15",
            ticketPrice: 500,
            agentPrice: 480
        }
    ];

    // Filter transactions based on the selected agent
    const filteredTransactions =
        selectedAgent === "All"
            ? transactions
            : transactions.filter(txn => txn.agentName === selectedAgent);

    // Show modal with transaction details
    const showDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    // Table columns
    const columns = [
        {
            title: "Transaction ID",
            dataIndex: "transactionId",
            key: "transactionId"
        },
        {
            title: "Ticket Name",
            dataIndex: "ticketName",
            key: "ticketName"
        },
        {
            title: "Agent",
            dataIndex: "agentName",
            key: "agentName",
            render: (name) => <Tag color={name === "Tolulope Ayeni" ? "blue" : "green"}>{name}</Tag>
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date"
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button type="primary" onClick={() => showDetails(record)}>View</Button>
            )
        }
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>Transactions</h2>

            {/* Agent Filter */}
            <Select
                placeholder="Filter by Agent"
                style={{ width: 200, marginBottom: "15px" }}
                value={selectedAgent}
                onChange={(value) => setSelectedAgent(value)}
            >
                <Option value="All">All</Option>
                <Option value="Tolulope Ayeni">Tolulope Ayeni</Option>
                <Option value="Obateru Anthony">Obateru Anthony</Option>
            </Select>

            {/* Transactions Table */}
            <div className="w-100 overflow-auto">
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    pagination={{ pageSize: 5 }}
                  
                />
            </div>

            {/* Transaction Details Modal */}
            <Modal
                title="Transaction Details"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>Close</Button>
                ]}
            >
                {selectedTransaction && (
                    <div>
                        <p><strong>Transaction ID:</strong> {selectedTransaction.transactionId}</p>
                        <p><strong>Ticket Name:</strong> {selectedTransaction.ticketName}</p>
                        <p><strong>Agent Name:</strong> {selectedTransaction.agentName}</p>
                        <p><strong>Date:</strong> {selectedTransaction.date}</p>
                        <p><strong>Ticket Price:</strong> ₦{selectedTransaction.ticketPrice}</p>
                        <p><strong>Agent Input Price:</strong> ₦{selectedTransaction.agentPrice}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Transactions;

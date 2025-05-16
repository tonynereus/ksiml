import { Table, Button, Select, Tag, Modal } from "antd";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../redux/store";
import apis from "../../utils/apis";

const { Option } = Select;

const Transactions = () => {
    const [selectedAgent, setSelectedAgent] = useState("All");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactions, setTransactions] = useState();
    const [agents, setAgents] = useState();
    const [reload, setReload] = useState(false);


    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(apis.getTransactions, "GET");
            if (res.status) {
                setTransactions(res.data.transactions);
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
        fetchTransactions();
    }, [reload]);



    // Dummy transactions data
    // const transactions = [
    //     {
    //         key: "1",
    //         transactionId: "TXN123456",
    //         ticketName: "Motocycle (Urban)",
    //         agentName: "Tolulope Ayeni",
    //         date: "2024-03-10 14:30",
    //         ticketPrice: 500,
    //         agentPrice: 550
    //     },
    //     {
    //         key: "2",
    //         transactionId: "TXN789012",
    //         ticketName: "Taxi (Cab, Urban)",
    //         agentName: "Obateru Anthony",
    //         date: "2024-03-09 12:45",
    //         ticketPrice: 500,
    //         agentPrice: 500
    //     },
    //     {
    //         key: "3",
    //         transactionId: "TXN345678",
    //         ticketName: "Keke Napep (Tricicle, Urban)",
    //         agentName: "Tolulope Ayeni",
    //         date: "2024-03-08 10:15",
    //         ticketPrice: 500,
    //         agentPrice: 480
    //     }
    // ];

    // Filter transactions based on the selected agent
    const filteredTransactions =
        selectedAgent === "All"
            ? transactions
            : transactions.filter(txn => txn.username === selectedAgent);

    // Show modal with transaction details
    const showDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    // Table columns
    const columns = [
        {
            title: "Transaction ID",
            dataIndex: "id",
            key: "transactionId"
        },
        {
            title: "Ticket Name",
            dataIndex: "ticket_name",
            key: "ticketName"
        },
        {
            title: "Agent",
            dataIndex: "username",
            key: "agentName",
            render: (name) => <Tag color={Math.floor(Math.random() * 2) == 1 ? "blue" : "green"}>{name}</Tag>
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "date",
            render:(name)=> (new Date(name).toLocaleDateString())
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
                {
                    agents && agents.map(x=><Option value={x.username}>{x.username}</Option>)
                }
            </Select>

            {/* Transactions Table */}
            <div className="w-100 overflow-auto">
                {
                    transactions && <Table
                        columns={columns}
                        dataSource={filteredTransactions}
                        pagination={{ pageSize: 5 }}

                    />
                }
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
                        <p><strong>Transaction ID:</strong> {selectedTransaction.id}</p>
                        <p><strong>Ticket Name:</strong> {selectedTransaction.ticket_name}</p>
                        <p><strong>Agent Name:</strong> {selectedTransaction.username}</p>
                        <p><strong>Date:</strong> {new Date(selectedTransaction.created_at).toLocaleDateString()}</p>
                        <p><strong>Ticket Price:</strong> ₦{selectedTransaction.ticket_price}</p>
                        {/* <p><strong>Agent Input Price:</strong> ₦{selectedTransaction.agentPrice}</p> */}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Transactions;

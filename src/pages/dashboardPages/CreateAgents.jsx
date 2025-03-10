import React, { useState } from "react";
import { Form, Input, Button, Card, message, InputNumber } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, WalletOutlined, LockOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "../../redux/store";
import apis from "../../utils/apis";

const CreateAgent = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const resu = await fetchWithAuth(apis.createAgents, "POST", values);
            console.log(resu);
            if (resu.status) {
                message.success(resu.message);
            } else {
                if (resu.message)
                    return message.error(resu.message);
                throw new Error("Error");
            }
        } catch (err) {
            console.log(err);
            message.error("Error creating agent");
        } finally {
            setLoading(false);
        }

        // Simulating API call for uniqueness check
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <Card title="Create New Agent" style={{ width: 400, borderRadius: 10, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                <Form layout="vertical" onFinish={onFinish}>
                    {/* Username */}
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Please enter a unique username!" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Enter username" />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        label="Password"
                        name="pswd"
                        rules={[{ required: true, message: "Password is required!" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {/* Wallet Balance */}
                    <Form.Item
                        label="Wallet Balance (₦)"
                        name="wallet_balance"
                        rules={[{ required: true, message: "Please set a starting balance!" }]}
                    >
                        <InputNumber
                            prefix={<WalletOutlined />}
                            style={{ width: "100%" }}
                            min={0}
                            placeholder="Enter initial balance"
                        />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Create Agent
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateAgent;

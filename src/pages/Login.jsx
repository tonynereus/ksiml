import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Alert, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../components/Logo";
import apis from "../utils/apis";

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try{
      //
      const response = await fetch(apis.signin,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({username:values.email,pswd:values.password})
      });
      const resu = await response.json();

      if(resu.status){
        message.success(resu.message);
        dispatch(login({token:resu.data.token,username:resu.data.user}));
        navigate("/dashboard");
      }else{
        if(resu.message)
          return setError(resu.message);
        throw new Error("Error in signin")
      }
    }catch(err){
      console.log('signin error ',err);
      setError(resu.message);
    }finally{
      setLoading(false);
    }

    // Fake API authentication (Replace with real API call)
    // setTimeout(() => {
    //   if (values.email === "admin@example.com" && values.password === "password") {
    //     dispatch(login("fake-auth-token")); // Dispatch login with a token
    //     navigate("/dashboard"); // Redirect to dashboard
    //   } else {
    //     setError("Invalid email or password.");
    //     setLoading(false);
    //   }
    // }, 1000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
      <Card className="shadow p-4" style={{ width: 400 }}>
        <Title level={2} className="text-center">
          <Logo wid={80}/>
        </Title>

        {error && <Alert message={error} type="error" showIcon className="mb-3" />}

        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

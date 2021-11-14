import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Typography, Avatar, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import env from '@beam-australia/react-env';
import axios from 'axios';

const SERVICE_URL = env('SERVICE_URL');

const { Text } = Typography;

const LoginPage = () => {
    let history = useHistory();
    const [isError, setIsError] = useState(false);
    const onFinish = (values) => {
        axios.post(`${SERVICE_URL}/user/login`, {...values}).then((res) => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            history.push("/contacts");
        }).catch(err => {
            setIsError(true);
        });
    };

    return (
        <Form
            className="login-form"
            onFinish={onFinish}
        >
            <Form.Item className="avatar-center">
                <Avatar size={64} icon={<UserOutlined />} />
            </Form.Item>
            <Form.Item className="avatar-center">
                <Text type="secondary">Login to Continue</Text>
            </Form.Item>
            <Form.Item>
                <div>
                    {isError && <Alert message={"You entered the email or password incorrectly!"}
                        type="error" showIcon closable />}
                </div>
            </Form.Item>
            <Form.Item>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Email"
                        rules={[
                            { required: true, message: 'Please input your Password!' },
                            {
                                type: 'email',
                                message: 'Please enter a valid e-mail address!'
                            },
                        ]} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    {' '}Or <a href="/register">register now!</a>
                </Form.Item>
            </Form.Item>
        </Form>
    )
}

export default LoginPage

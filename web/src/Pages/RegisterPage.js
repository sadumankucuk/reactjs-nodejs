import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Avatar, Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import env from '@beam-australia/react-env';
import axios from 'axios';

const SERVICE_URL = env('SERVICE_URL');

const RegisterPage = () => {
    let history = useHistory();
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onFinish = (values) => {
        axios.post(`${SERVICE_URL}/user/sign-up`, {...values}).then((res) => {
            history.push('/login');
        }).catch(err => {
            setIsError(true);
            setErrorMessage('Something went wrong!');
        })
    };

    return (
        <div
            className="login-form"
        >
            <Avatar size={64} icon={<UserOutlined />} className="avatar-center-register" />
            <Form
                onFinish={onFinish}
            >
                {
                    isError &&
                    <Form.Item>
                        <div>
                            {isError && <Alert message={errorMessage}
                                type="error" />}
                        </div>
                    </Form.Item>
                }
                <Form.Item>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your Name!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
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
                            Register
                        </Button>
                        {' '} Have you a account? <a href="/login">login</a>
                    </Form.Item>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterPage;

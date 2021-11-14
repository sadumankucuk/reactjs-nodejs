import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import env from '@beam-australia/react-env';
import axios from 'axios';

const SERVICE_URL = env('SERVICE_URL');

const ContactPage = () => {
    const [form] = Form.useForm();
    let history = useHistory();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    let { contactId } = useParams();

    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (contactId) {
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
            axios.get(`${SERVICE_URL}/contact/${contactId}`, config).then((res) => {
                form.setFieldsValue({
                    name: res.data.name,
                    surname: res.data.surname,
                    companyName: res.data.companyName,
                    phones: res.data.phones.map(item => ({ phone: item.phone, id: item.id }))

                });

            }).catch(err => {
                setIsError(true)
            })
        }
    }, [contactId])

    const onFinish = (values) => {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        if (!contactId) {
            axios.post(`${SERVICE_URL}/contact`, {
                name: values.name,
                surname: values.surname,
                companyName: values.companyName,
                userId,
                phones: values.phones
            }, config).then((res) => {
                history.push("/contacts");
            }).catch(err => {
                setIsError(true);
            })
        } else {
            axios.patch(`${SERVICE_URL}/contact/${contactId}`, {
                name: values.name,
                surname: values.surname,
                companyName: values.companyName,
                userId,
                phones: values.phones
            }, config).then((res) => {
                history.push("/contacts");
            }).catch(err => {
                setIsError(true);
            })
        }
    }

    return (
        <Form
            onFinish={onFinish}
            layout="vertical"
            style={{ margin: "15px" }}
            form={form}
        >
            {
                isError &&
                <Form.Item>
                    <div>
                        {isError && <Alert message={"Something went wrong!"} type="error" />}
                    </div>
                </Form.Item>
            }
            <Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your Name!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
                </Form.Item>

                <Form.Item
                    label="Surname"
                    name="surname"
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Surname" />
                </Form.Item>

                <Form.Item
                    label="Company Name"
                    name="companyName"
                >
                    <Input placeholder="Company Name" />
                </Form.Item>
                <Form.List
                    name="phones"
                    rules={[
                        {
                            validator: async (_, phones) => {
                                if (!phones || phones.length < 1) {
                                    return Promise.reject(new Error('At least 1 phone number'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((key, name, fieldKey, ...restField) => (
                                <Form.Item
                                    label={'Phone Number'}
                                    required={true}
                                    key={key.name}
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'phone']}
                                        fieldKey={[fieldKey, 'id']}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Please input phone number!",
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="phone number" style={{ width: fields.length !== 1 ? '98%' : '100%' }} />
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => { 
                                        add();
                                    }}
                                    icon={<PlusOutlined />}
                                >
                                    Add Phone Number
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        {contactId ? "Update Contact" : "Save Contact"}
                    </Button>
                </Form.Item>
            </Form.Item>
        </Form>
    )
}

export default ContactPage

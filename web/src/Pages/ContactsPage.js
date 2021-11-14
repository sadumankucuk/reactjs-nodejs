import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Table, Input, Button, Space, Result } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import env from '@beam-australia/react-env';
import axios from 'axios';

const { Search } = Input;

const SERVICE_URL = env('SERVICE_URL');

const ContactsPage = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    let history = useHistory();

    const [data, setData] = useState();
    const [isError, setIsError] = useState(false);

    const getData = () => {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        axios.get(`${SERVICE_URL}/contact?userId=${userId}`, config).then((res) => {
            if (res.data.length === 0) {
                setData([]);
                history.push("/contact");
            } else setData(res.data);
        }).catch(err => {
            setIsError(true);
        });
    }

    useEffect(() => {
        getData();
    }, [])

    const deleteContact = (id) => {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        axios.delete(`${SERVICE_URL}/contact/${id}`, config).then((res) => {
            getData();
        }).catch(err => {
            setIsError(true);
        });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Surname',
            dataIndex: 'surname',
            key: 'surname',
            width: '20%',
            sorter: (a, b) => a.surname.length - b.surname.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName',
            sorter: (a, b) => a.companyName?.length - b.companyName?.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => history.push(`/contact/${record.id}`)}>Update</Button>
                    <Button type="link" onClick={() => deleteContact(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const handleSearch = (value) => {

        const splitValue = value.split(' ');

        let config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        axios.get(
            `${SERVICE_URL}/contact/search?userId=${userId}
            &name=${splitValue.length === 2 ? splitValue[0] : value}
            &surname=${splitValue.length === 2 ? splitValue[1] : value}&companyName=${value}&phone=${value}`,
            config)
            .then((res) => {
                setData(res.data);
            }).catch(err => {
                setIsError(true);
            });
    }

    return (
        <>

            {
                !isError ? (
                    <>
                        <div style={{ display: "flex" }}>
                            <Search placeholder="Search Contact" onSearch={(value) => handleSearch(value)} enterButton />
                            <Button type="primary"
                                onClick={() => {
                                    history.push('/contact');
                                }}>
                                Add Contact
                            </Button>
                            <Button
                                type="default"
                                icon={<LogoutOutlined />}
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("userId");
                                    history.push('/login');
                                }}
                            >Logout</Button>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="id"
                        />
                    </>
                ) :
                    (
                        <Result
                            status="404"
                            title="404"
                            subTitle="Sorry, the page you visited does not exist."

                            extra={<Button type="primary"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("userId");
                                    history.push('/login');
                                }}>Back Home</Button>}
                        />)
            }
        </>
    )
}

export default ContactsPage

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Modal, Col, Row, Space, message } from 'antd';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';

import {
  getAllContacts,
  getContactDetails,
  deleteContact,
} from '../../redux/apiCalls/contactApiCall';

function Contact() {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contact.contacts);
  const { loading, isPostCreated } = useSelector((state) => state.contact);
  const selectedContact = useSelector((state) => state.contact.contact);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const { confirm } = Modal;


  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  // Afficher les détails du contact
  const showDetailsModal = (id) => {
    setIsModalDetailsVisible(true);
    dispatch(getContactDetails(id));
  };

  // Fermer les modales
  const handleDetailsCancel = () => {
    setIsModalDetailsVisible(false);
  };



  const handleDeleteContact = (contactId) => {
    confirm({
      title: 'Are you sure you want to delete this partner?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        dispatch(deleteContact(contactId));
        message.success('Partner deleted successfully');
      },
      onCancel() {
        message.info('Deletion canceled');
      },
    });
  };

  const columns = [
    {
      title: 'name ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <InfoCircleOutlined
            style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => showDetailsModal(record._id)}
          />
          <DeleteOutlined
            style={{ fontSize: '20px', color: 'red', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => handleDeleteContact(record?._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={contacts} loading={loading} rowKey="_id" />

      {/* Modal pour afficher les détails du contact */}
      <Modal
        title="Détails du contact"
        open={isModalDetailsVisible}
        onCancel={handleDetailsCancel}
        destroyOnClose
      >
        {selectedContact && (
          <div>
            <h2>{selectedContact.name}</h2>
            <Row>
              <Col span={12}>
                <p><strong>Email:</strong> {selectedContact.email}</p>
                <p><strong>Country:</strong> {selectedContact.country}</p>
                <p><strong>Phone:</strong> {selectedContact.phone}</p>
                <p>
                  <strong>Date:</strong> {new Date(selectedContact.created_at).toISOString().split('T')[0]}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(selectedContact.created_at).toTimeString().split(' ')[0]}
                </p>
              </Col>
              <Col span={12}>
                <p><strong>Message:</strong> {selectedContact.message}</p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Contact;

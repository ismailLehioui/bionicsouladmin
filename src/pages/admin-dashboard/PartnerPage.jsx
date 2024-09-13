import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Image, Button, Modal, Form, Input, Upload, Col, Row, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  getAllPartners,
  getPartnerDetails,
  addPartner,
  updatePartner,
  deletePartner,
} from '../../redux/apiCalls/partnerApiCall';

function PartnerPage() {
  const [form] = Form.useForm(); // Initialisation du formulaire
  const dispatch = useDispatch();
  const partners = useSelector((state) => state.partner.partners.partners);
  const loading = useSelector((state) => state.partner.loading);
  // const { loading, setIsPostCreated } = useSelector((state) => state.partner);
  const selectedPartner = useSelector((state) => state.partner.partner);

  const [name, setTitle] = useState(""); // État pour le titre du partenaire
  const [description, setDescription] = useState(""); // État pour la description du partenaire
  const [website, setPrice] = useState(""); // État pour le website du partenaire
  const [file, setFile] = useState(null); // État pour l'image du partenaire
  // const [existingImage, setExistingImage] = useState(""); // État pour l'image existante du partenaire

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);

  const { confirm } = Modal;

  useEffect(() => {
    dispatch(getAllPartners());
  }, [dispatch]);

  // Ajouter un partenaire
  const handleAddPartner = () => {
    form.resetFields();
    setCurrentPartner(null);
    setFile(null); // Réinitialiser le fichier
    setIsModalVisible(true);
  };

  // Modifier un partenaire
  const handleEditPartner = (partner) => {
    setCurrentPartner(partner);
    form.setFieldsValue({
      name: partner.name,
      website: partner.website,
      description: partner.description,
    });
    setIsModalUpdateVisible(true);
  };

  const handleModalEditCancel = () => {
    setIsModalUpdateVisible(false);
  };

  // Afficher les détails du partenaire
  const showDetailsModal = (id) => {
    setIsModalDetailsVisible(true);
    dispatch(getPartnerDetails(id));
  };

  // Fermer les modales
  const handleDetailsCancel = () => {
    setIsModalDetailsVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Supprimer un partenaire
  const handleDeletePartner = (partnerId) => {
    confirm({
      title: 'Are you sure you want to delete this partner?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        dispatch(deletePartner(partnerId));
        message.success('Partner deleted successfully');
      },
      onCancel() {
        message.info('Deletion canceled');
      },
    });
  };

  // L'ajout du partenaire 
  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description !== "" ? description : "no description");
      formData.append('website', website !== "" ? website : "no website");
      if (file) {
        formData.append('image', file);
      } else {
        message.error("Please select an image.");
        return;
      }
      dispatch(addPartner(formData));
      setIsModalVisible(false);
      form.resetFields();
      message.success('Partner added successfully');
    } catch (error) {
      message.error("Error adding partner");
    }
  };


  // Update partner
  const handleEditFinish = async (values) => {
    const updateData = {
      name: values.name,
      website: values.website,
      description: values.description,
    };

    if (file) {
      updateData.image = file; // Don't forget to handle image upload
    }

    await dispatch(updatePartner(currentPartner._id, updateData));
    setIsModalVisible(false);
    form.resetFields();
    setFile(null);
    setIsModalUpdateVisible(false);
    message.success('Partner updated successfully!');
  };

  const columns = [
    {
      title: 'Partner Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => (
        <Image
          width={50}
          src={record?.image?.url}
          placeholder={<Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200" width={50} />}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <InfoCircleOutlined
            style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => showDetailsModal(record?._id)}
          />
          <EditOutlined
            style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => handleEditPartner(record)}
          />
          <DeleteOutlined
            style={{ fontSize: '20px', color: 'red', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => handleDeletePartner(record?._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddPartner} style={{ marginBottom: 16 }}>
        Add Partner
      </Button>
      <Table columns={columns} dataSource={partners} loading={loading} rowKey="_id" />

      {/* Modal pour ajouter un partenaire */}
      <Modal
        name={'Add Partner'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Partner Name"
            rules={[{ required: true, message: 'Please enter the partner name' }]}
          >
            <Input value={name} onChange={(e) => setTitle(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          // rules={[{ required: true, message: 'Please enter the partner description' }]}
          >
            <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
          // rules={[{ required: true, message: 'Please enter the partner website' }]}
          >
            <Input value={website} onChange={(e) => setPrice(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Partner Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[{ required: true, message: 'Please select an image' }]}
          >
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={(info) => {
                if (info.fileList.length > 0) {
                  const file = info.fileList[0].originFileObj;
                  const fileSize = file.size; // Taille du fichier en octets

                  // Vérification de la taille du fichier
                  if (fileSize > 2097152) { // 2097152 octets = 2 Mo
                    message.error("La taille de l'image ne doit pas dépasser 2Mo");
                    info.fileList.pop(); // Supprimer le fichier de la liste
                    return;
                  }

                  // Mettez à jour l'état avec le fichier sélectionné
                  setFile(file);
                } else {
                  setFile(null);
                }
              }}
              showUploadList={{ showPreviewIcon: false }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Partner
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal pour modifier un partenaire */}
      <Modal
        title="Edit Partner"
        visible={isModalUpdateVisible}
        onCancel={handleModalEditCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Partner Name"
            rules={[{ required: true, message: 'Please enter the partner name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the partner description' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true, message: 'Please enter the partner website' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Partner Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={(info) => {
                if (info.fileList.length > 0) {
                  const file = info.fileList[0].originFileObj;
                  const fileSize = file.size; // Taille du fichier en octets

                  // Vérification de la taille du fichier
                  if (fileSize > 2097152) { // 2097152 octets = 2 Mo
                    message.error("La taille de l'image ne doit pas dépasser 2Mo");
                    info.fileList.pop(); // Supprimer le fichier de la liste
                    return;
                  }

                  // Mettez à jour l'état avec le fichier sélectionné
                  setFile(file);
                } else {
                  setFile(null);
                }
              }}
              showUploadList={{ showPreviewIcon: false }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Partner
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal pour les détails du partenaire */}
      <Modal
        title="Partner Details"
        visible={isModalDetailsVisible}
        onCancel={handleDetailsCancel}
        footer={null}
      >
        {selectedPartner ? (
          <div>
            <Row>
              <Col span={24}>
                <Image
                  width={200}
                  src={selectedPartner.image?.url || 'https://via.placeholder.com/200'}
                  alt="Partner"
                />
              </Col>
              <Col span={24}>
                <h3>{selectedPartner.name}</h3>
                <p>{selectedPartner.description}</p>
                <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer">
                  {selectedPartner.website}
                </a>
              </Col>
            </Row>
          </div>
        ) : (
          <p>No details available</p>
        )}
      </Modal>
    </div>
  );
}

export default PartnerPage;

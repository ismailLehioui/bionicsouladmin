import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Image, Button, Modal, Form, Input, Upload, Col, Row, Space, DatePicker, message } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import {
  getAllAwards,
  getAwardDetails,
  addAward,
  updateAward,
  deleteAward,
} from '../../redux/apiCalls/awardApiCall';

const AwardPage = () => {
  const [form] = Form.useForm(); // Initialisation du formulaire
  const dispatch = useDispatch();
  const awards = useSelector((state) => state.award.awards);
  const selectedAward = useSelector((state) => state.award.award);
  const { loading } = useSelector((state) => state.award);

  const [title, setTitle] = useState(""); // État pour le titre de l'award
  const [description, setDescription] = useState(""); // État pour la description de l'award
  const [date, setDate] = useState(null); // État pour la date de l'award
  const [file, setFile] = useState(null); // État pour l'image de l'award

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [currentAward, setCurrentAward] = useState(null);

  useEffect(() => {
    dispatch(getAllAwards());
  }, [dispatch]);

  // Ajouter un award
  const handleAddAward = () => {
    form.resetFields();
    setCurrentAward(null);
    setFile(null); // Réinitialiser le fichier
    setIsModalVisible(true);
  };

  // Modifier un award
  const handleEditAward = (award) => {
    setCurrentAward(award);
    form.setFieldsValue({
      title: award.title,
      date: award.date ? moment(award.date) : null, // Convertir la date en moment
      description: award.description,
    });
    setIsModalUpdateVisible(true);
  };

  // Afficher les détails de l'award
  const showDetailsModal = (id) => {
    setIsModalDetailsVisible(true);
    dispatch(getAwardDetails(id));
  };

  // Fermer les modales
  const handleDetailsCancel = () => {
    setIsModalDetailsVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  const handleUpdateModalCancel = () => {
    setIsModalUpdateVisible(false);
  };

  // Supprimer un award
  const handleDeleteAward = (awardId) => {
    dispatch(deleteAward(awardId));
  };

  // Ajout d'un award
  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('date', values.date ? values.date.toISOString() : null);
      // formData.append('description', values.description);
      formData.append('description', description !== "" ? description : "no description");
      if (file) {
        formData.append('image', file);
      } else {
        message.error("Veuillez sélectionner une image.");
        return;
      }
      await dispatch(addAward(formData));
      setIsModalVisible(false);
      form.resetFields();
      message.success('Award ajouté avec succès');
    } catch (error) {
      message.error("Erreur lors de l'ajout de l'award");
    } finally {
      setTitle("");
      setDescription("");
      setDate(null);
      setFile(null);
    }
  };

  // Avant le téléchargement de l'image


  // Mise à jour d'un award
  const handleEditFinish = async (values) => {
    const updateData = {
      title: values.title,
      date: values.date ? values.date.toISOString() : null,
      description: values.description,
    };

    if (file) {
      updateData.image = file; // Ne pas oublier de gérer l'upload d'image
    }

    await dispatch(updateAward(currentAward._id, updateData));
    setIsModalUpdateVisible(false);
    form.resetFields();
    setFile(null);
    message.success('Award mis à jour avec succès!');
  };

  const columns = [
    {
      title: 'Nom du award',
      dataIndex: 'title',
      key: 'title',
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text ? new Date(text).toLocaleDateString() : ''}
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
            onClick={() => showDetailsModal(record._id)}
          />
          <EditOutlined
            style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => handleEditAward(record)}
          />
          <DeleteOutlined
            style={{ fontSize: '20px', color: 'red', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => handleDeleteAward(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddAward} style={{ marginBottom: 16 }}>
        Ajouter un award
      </Button>
      <Table columns={columns} dataSource={awards} loading={loading} rowKey="_id" />

      {/* Modal pour ajouter un award */}
      <Modal
        title="Ajouter un award"
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
            name="title"
            label="Nom du award"
            rules={[{ required: true, message: 'Veuillez entrer le nom du award' }]}
          >
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          // rules={[{ required: true, message: 'Veuillez entrer la description du award' }]}
          >
            <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Veuillez entrer la date du award' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              value={date}
              onChange={(date) => setDate(date)}
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image du award"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[{ required: true, message: 'Veuillez sélectionner une image' }]}
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
            >
              <Button icon={<UploadOutlined />}>Cliquer pour télécharger</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal pour modifier un award */}
      <Modal
        title="Modifier un award"
        open={isModalUpdateVisible}
        onCancel={handleUpdateModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditFinish}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Nom du award"
            rules={[{ required: true, message: 'Veuillez entrer le nom du award' }]}
          >
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Veuillez entrer la description du award' }]}
          >
            <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Veuillez entrer la date du award' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              value={date}
              onChange={(date) => setDate(date)}
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image du award"
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
            >
              <Button icon={<UploadOutlined />}>Cliquer pour télécharger</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Modifier
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal pour afficher les détails d'un award */}
      <Modal
        title="Détails du award"
        open={isModalDetailsVisible}
        onCancel={handleDetailsCancel}
        footer={null}
      >
        {selectedAward && (
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Image src={selectedAward?.image?.url} />
            </Col>
            <Col span={16}>
              <h3>{selectedAward.title}</h3>
              <p>{new Date(selectedAward.date).toLocaleDateString()}</p>
              <p>{selectedAward.description}</p>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default AwardPage;

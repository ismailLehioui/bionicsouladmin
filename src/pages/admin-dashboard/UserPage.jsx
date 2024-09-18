import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Image, Button, Modal, Form, Input, Upload, Col, Row, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  getAllUsers,
  getUserDetails,
  addUser,
  updateUser,
  deleteUser,
} from '../../redux/apiCalls/userApiCall';
import './style.css'

const UserPage = () => {
  const [form] = Form.useForm(); // Initialisation du formulaire
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const { loading, isPostCreated } = useSelector((state) => state.user);
  const selectedUser = useSelector((state) => state.user.user);

  const [title, setTitle] = useState(""); // État pour le titre du produit
  const [description, setDescription] = useState(""); // État pour la description du produit
  const [price, setPrice] = useState(0); // État pour le prix du produit
  const [file, setFile] = useState(null); // État pour l'image du produit


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { confirm } = Modal;



  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Ajouter un produit
  const handleAddUser = () => {
    form.resetFields();
    setCurrentUser(null);
    setFile(null); // Réinitialiser le fichier
    setIsModalVisible(true);
  };

  // Modifier un produit
  const handleEditUser = (user) => {
    setCurrentUser(user);
    form.setFieldsValue({
      title: user.title,
      price: user.price,
      description: user.description,
    });
    setIsModalUpdateVisible(true);
  };

  // Afficher les détails du produit
  const showDetailsModal = (id) => {
    setIsModalDetailsVisible(true);
    dispatch(getUserDetails(id));
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

  // Supprimer un produit
  // const handleDeleteUser = (userId) => {
  //   dispatch(deleteUser(userId));
  // };
  const handleDeleteUser = (userId) => {
    confirm({
      title: 'Are you sure you want to delete this partner?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        dispatch(deleteUser(userId));
        message.success('Partner deleted successfully');
      },
      onCancel() {
        message.info('Deletion canceled');
      },
    });
  };


  // l'ajout du produit 
  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      if (file) {
        formData.append('image', file);
      } else {
        message.error("Veuillez sélectionner une image.");
        return;
      }
      await dispatch(addUser(formData))
      //setUsers([...users, response.data.user]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Produit ajouté avec succès');
    } catch (error) {
      message.error("Erreur lors de l'ajout du produit");
    }
  };

  //update produit 
  const handleEditFinish = async (values) => {
    const updateData = {
      title: values.title,
      price: values.price,
      description: values.description,
    };

    if (file) {
      updateData.image = file; // Ne pas oublier de gérer l'upload d'image
    }

    await dispatch(updateUser(currentUser._id, updateData));
    setIsModalVisible(false);
    form.resetFields();
    setFile(null);
    setIsModalUpdateVisible(false);
    message.success('Produit mis à jour avec succès!');
  };

  // const beforeUpload = (file) => {
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error('L\'image doit être inférieure à 2MB!');
  //     return false;
  //   }
  //   return true;
  // };


  const columns = [
    {
      title: 'Name',
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
    // {
    //   title: 'passwor',
    //   dataIndex: 'price',
    //   key: 'price',
    //   render: (text) => (
    //     <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    //       {text}
    //     </span>
    //   ),
    // },
    {
      title: 'Image',
      dataIndex: 'profilePhoto',
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
            onClick={() => handleEditUser(record)}
          />
          <DeleteOutlined
            style={{ fontSize: '20px', color: 'red', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => handleDeleteUser(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddUser} style={{ marginBottom: 16 }} >
        Ajouter un produit
      </Button>
      <Table columns={columns} dataSource={users} loading={loading} rowKey="_id" />

      {/* Modal pour ajouter un produit */}
      <Modal
        title={'Ajouter un produit'}
        open={isModalVisible}
        // onOk={handleFinish}
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
            label="Nom du produit"
            rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
          >
            <Input value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Veuillez entrer la description du produit' }]}
          >
            <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Prix"
            rules={[{ required: true, message: 'Veuillez entrer le prix du produit' }]}
          >
            <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image du produit"
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
            // beforeUpload={(beforeUpload)}
            // onChange={(info) => {
            //   if (info.fileList.length > 0) {
            //     const file = info.fileList[0].originFileObj; // Ou info.fileList[0].thumbUrl pour prévisualisation

            //     // Mettez à jour l'état avec le fichier sélectionné (pour upload)
            //     setFile(file);
            //   } else {
            //     setFile(null);
            //   }
            // }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {'Ajouter'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>


      {/* Modal pour éditer un produit */}
      <Modal
        title={'Modifier un produit'}
        open={isModalUpdateVisible}
        // onOk={handleEditFinish}
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
            label="Nom du produit"
            rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
          >
            <Input value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Veuillez entrer la description du produit' }]}
          >
            <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Prix"
            rules={[{ required: true, message: 'Veuillez entrer le prix du produit' }]}
          >
            <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image du produit"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          // rules={[{ required: true, message: 'Veuillez sélectionner une image' }]}
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
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {'Update'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal pour afficher les détails du produit */}
      <Modal
        title="Détails du produit"
        open={isModalDetailsVisible}
        onCancel={handleDetailsCancel}
        destroyOnClose
      >
        {selectedUser && (
          <div>
            <h2>{selectedUser.name}</h2>
            <Row>
              <Col span={12}>
                <Image
                  width={200}
                  src={selectedUser?.image?.url}
                  placeholder={
                    <Image
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                      width={100}
                    />
                  }
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: 'auto',
                  }}
                />
              </Col>
              <Col span={12}>
                {/* <p><strong>Prix:</strong> {selectedUser.price}</p> */}
                <p>
                  <strong>Date:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toISOString().split('T')[0] : "Date non disponible"}
                </p>
                <p>
                  <strong>Time:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toTimeString().split(' ')[0] : "Heure non disponible"}
                </p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserPage;
















// import React, { useEffect } from 'react'
// import { useState } from 'react'
// import { Table, message } from 'antd';
// import { Image } from 'antd';
// import axios from 'axios';
// import { render } from '@testing-library/react';
// import { RiDeleteBin6Line } from "react-icons/ri";

// function UserPage() {
//   const [user, setUser] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);


//   const handleDelete = async (id) => {
//     try {
//       setUser(user.filter(item => item.id !== id));
//       message.success('utilisateur supprimé avec succès');
//     } catch (error) {
//       message.error('Erreur lors de la suppression du produit');
//     }
//   };

//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },

//     {
//       title: 'Last name',
//       dataIndex: 'lastename',
//       key: 'lastname',
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: 'Bio',
//       dataIndex: 'bio',
//       key: 'bio',
//     },
//     {
//       title: 'Profile Photo',
//       dataIndex: 'profilePhoto',
//       key: 'profilePhoto',
//       render: (_, record) => {
//         return (
//           <main className="main-content position-ab max-height-vh-100 h-100 border-radius-lg " >

//             <Image
//               width={50}
//               src={record?.profilePhoto.url}
//               placeholder={
//                 <Image
//                   preview={false}
//                   src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
//                   width={100}
//                 />

//               }
//             />
//           </main>)
//       }
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'id',
//       key: 'id',
//       render: (_, record) => {
//         return (
//           <RiDeleteBin6Line
//             style={{ fontSize: "20", color: "red", cursor: "pointer" }}
//             onClick={() => handleDelete(record.id)}
//           />)
//       }
//     },
//   ];
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:3002/api/users/all');
//         setUser(response.data);
//       } catch (error) {
//         setError(error);
//       }
//       setIsLoading(false);
//     };

//     fetchData()
//     console.log(user)

//   }, [user]
//   )
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div>

//       <Table dataSource={user} columns={columns} />;

//     </div>
//   )
// }

// export default UserPage
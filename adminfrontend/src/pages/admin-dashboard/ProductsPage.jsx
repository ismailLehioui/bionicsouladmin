import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Image, Button, Modal, Form, Input, Upload, Col, Row, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  getAllProducts,
  getProductDetails,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../../redux/apiCalls/productApiCall';
import './style.css'

const ProductPage = () => {
  const [form] = Form.useForm(); // Initialisation du formulaire
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const { loading, isPostCreated } = useSelector((state) => state.product);
  const selectedProduct = useSelector((state) => state.product.product);

  const [title, setTitle] = useState(""); // État pour le titre du produit
  const [description, setDescription] = useState(""); // État pour la description du produit
  const [price, setPrice] = useState(0); // État pour le prix du produit
  const [file, setFile] = useState(null); // État pour l'image du produit


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const { confirm } = Modal;



  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Ajouter un produit
  const handleAddProduct = () => {
    form.resetFields();
    setCurrentProduct(null);
    setFile(null); // Réinitialiser le fichier
    setIsModalVisible(true);
  };

  // Modifier un produit
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    form.setFieldsValue({
      title: product.title,
      price: product.price,
      description: product.description,
    });
    setIsModalUpdateVisible(true);
  };

  // Afficher les détails du produit
  const showDetailsModal = (id) => {
    setIsModalDetailsVisible(true);
    dispatch(getProductDetails(id));
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
  // const handleDeleteProduct = (productId) => {
  //   dispatch(deleteProduct(productId));
  // };
  const handleDeleteProduct = (productId) => {
    confirm({
      title: 'Are you sure you want to delete this partner?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        dispatch(deleteProduct(productId));
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
      await dispatch(addProduct(formData))
      //setProducts([...products, response.data.product]);
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

    await dispatch(updateProduct(currentProduct._id, updateData));
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
      title: 'Nom du produit',
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
      title: 'Prix',
      dataIndex: 'price',
      key: 'price',
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
            onClick={() => showDetailsModal(record._id)}
          />
          <EditOutlined
            style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => handleEditProduct(record)}
          />
          <DeleteOutlined
            style={{ fontSize: '20px', color: 'red', cursor: 'pointer', marginLeft: '20px' }}
            onClick={() => handleDeleteProduct(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddProduct} style={{ marginBottom: 16 }} >
        Ajouter un produit
      </Button>
      <Table columns={columns} dataSource={products} loading={loading} rowKey="_id" />

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
        {selectedProduct && (
          <div>
            <h2>{selectedProduct.title}</h2>
            <Row>
              <Col span={12}>
                <Image
                  width={200}
                  src={selectedProduct?.image?.url}
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
                <p><strong>Prix:</strong> {selectedProduct.price}</p>
                <p>
                  <strong>Date:</strong> {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toISOString().split('T')[0] : "Date non disponible"}
                </p>
                <p>
                  <strong>Time:</strong> {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toTimeString().split(' ')[0] : "Heure non disponible"}
                </p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductPage;














// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Table, Image, Button, Modal, Form, Input, Upload, Col, Row, Space, message, Popconfirm } from 'antd';
// import { DeleteOutlined, EditOutlined, UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
// import {
//   getAllProducts,
//   getProductDetails,
//   addProduct,
//   updateProduct,
//   deleteProduct,
// } from '../../redux/apiCalls/productApiCall';

// const ProductPage = () => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const products = useSelector((state) => state.product.products);
//   const { loading, isPostCreated } = useSelector((state) => state.product);
//   const selectedProduct = useSelector((state) => state.product.product);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState(0);
//   const [file, setFile] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
//   const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);

//   useEffect(() => {
//     dispatch(getAllProducts());
//   }, [dispatch]);

//   const handleAddProduct = () => {
//     form.resetFields();
//     setCurrentProduct(null);
//     setFile(null);
//     setIsModalVisible(true);
//   };

//   const handleEditProduct = (product) => {
//     setCurrentProduct(product);
//     form.setFieldsValue({
//       title: product.title,
//       price: product.price,
//       description: product.description,
//     });
//     setIsModalUpdateVisible(true);
//   };

//   const showDetailsModal = (id) => {
//     setIsModalDetailsVisible(true);
//     dispatch(getProductDetails(id));
//   };

//   const handleDetailsCancel = () => {
//     setIsModalDetailsVisible(false);
//   };

//   const handleModalCancel = () => {
//     setIsModalVisible(false);
//   };

//   const handleUpdateModalCancel = () => {
//     setIsModalUpdateVisible(false);
//   };

//   const handleDeleteProduct = (productId) => {
//     dispatch(deleteProduct(productId));
//     message.success('Product deleted successfully');
//   };

//   const handleFinish = async (values) => {
//     try {
//       const formData = new FormData();
//       formData.append('title', values.title);
//       formData.append('price', values.price);
//       formData.append('description', values.description);
//       if (file) {
//         formData.append('image', file);
//       } else {
//         message.error("Please select an image.");
//         return;
//       }
//       await dispatch(addProduct(formData));
//       message.success('Product added successfully');
//       setIsModalVisible(false);
//       form.resetFields();
//     } catch (error) {
//       message.error("Error adding the product");
//     } finally {
//       setFile(null);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error('Image must be smaller than 2MB!');
//       return false;
//     }
//     return true;
//   };

//   const handleEditFinish = async (values) => {
//     const updateData = {
//       title: values.title,
//       price: values.price,
//       description: values.description,
//     };

//     if (file) {
//       updateData.image = file;
//     }

//     await dispatch(updateProduct(currentProduct._id, updateData));
//     setIsModalUpdateVisible(false);
//     form.resetFields();
//     setFile(null);
//     message.success('Product updated successfully!');
//   };

//   const columns = [
//     {
//       title: 'Product Name',
//       dataIndex: 'title',
//       key: 'title',
//       render: (text) => (
//         <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//           {text}
//         </span>
//       ),
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description',
//       key: 'description',
//       render: (text) => (
//         <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//           {text}
//         </span>
//       ),
//     },
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       key: 'price',
//       render: (text) => (
//         <span style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//           {text}
//         </span>
//       ),
//     },
//     {
//       title: 'Image',
//       dataIndex: 'image',
//       key: 'image',
//       render: (_, record) => (
//         <Image
//           width={50}
//           src={record?.image?.url}
//           placeholder={<Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200" width={50} />}
//         />
//       ),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <InfoCircleOutlined
//             style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '20px' }}
//             onClick={() => showDetailsModal(record._id)}
//           />
//           <EditOutlined
//             style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '20px' }}
//             onClick={() => handleEditProduct(record)}
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this product?"
//             onConfirm={() => handleDeleteProduct(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <DeleteOutlined
//               style={{ fontSize: '20px', color: 'red', cursor: 'pointer', marginLeft: '20px' }}
//             />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Button type="primary" onClick={handleAddProduct} style={{ marginBottom: 16 }}>
//         Add Product
//       </Button>
//       <Table
//         columns={columns}
//         dataSource={products}
//         loading={loading}
//         rowKey="_id"
//         locale={{ emptyText: 'No products available' }}
//       />

//       {/* Modal for adding a product */}
//       <Modal
//         title={'Add Product'}
//         open={isModalVisible}
//         onCancel={handleModalCancel}
//         footer={null}
//         destroyOnClose
//       >
//         <Form
//           form={form}
//           onFinish={handleFinish}
//           layout="vertical"
//         >
//           <Form.Item
//             name="title"
//             label="Product Name"
//             rules={[{ required: true, message: 'Please enter the product name' }]}
//           >
//             <Input value={title} onChange={(e) => setTitle(e.target.value)} />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: 'Please enter the product description' }]}
//           >
//             <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
//           </Form.Item>
//           <Form.Item
//             name="price"
//             label="Price"
//             rules={[{ required: true, message: 'Please enter the product price' }]}
//           >
//             <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
//           </Form.Item>
//           <Form.Item
//             name="image"
//             label="Product Image"
//             valuePropName="fileList"
//             getValueFromEvent={(e) => e && e.fileList}
//             rules={[{ required: true, message: 'Please select an image' }]}
//           >
//             <Upload
//               name="image"
//               listType="picture-card"
//               maxCount={1}
//               beforeUpload={beforeUpload}
//               onChange={(info) => {
//                 if (info.fileList.length > 0) {
//                   const file = info.fileList[0].originFileObj;
//                   setFile(file);
//                 } else {
//                   setFile(null);
//                 }
//               }}
//             >
//               {file ? (
//                 <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%' }} />
//               ) : (
//                 <Button icon={<UploadOutlined />}>Upload</Button>
//               )}
//             </Upload>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Add
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Modal for editing a product */}
//       <Modal
//         title="Edit Product"
//         open={isModalUpdateVisible}
//         onCancel={handleUpdateModalCancel}
//         footer={null}
//         destroyOnClose
//       >
//         <Form
//           form={form}
//           onFinish={handleEditFinish}
//           layout="vertical"
//         >
//           <Form.Item
//             name="title"
//             label="Product Name"
//             rules={[{ required: true, message: 'Please enter the product name' }]}
//           >
//             <Input value={title} onChange={(e) => setTitle(e.target.value)} />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: 'Please enter the product description' }]}
//           >
//             <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
//           </Form.Item>
//           <Form.Item
//             name="price"
//             label="Price"
//             rules={[{ required: true, message: 'Please enter the product price' }]}
//           >
//             <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
//           </Form.Item>
//           <Form.Item
//             name="image"
//             label="Product Image"
//             valuePropName="fileList"
//             getValueFromEvent={(e) => e && e.fileList}
//           >
//             <Upload
//               name="image"
//               listType="picture-card"
//               maxCount={1}
//               beforeUpload={beforeUpload}
//               onChange={(info) => {
//                 if (info.fileList.length > 0) {
//                   const file = info.fileList[0].originFileObj;
//                   setFile(file);
//                 } else {
//                   setFile(null);
//                 }
//               }}
//               showUploadList={{ showPreviewIcon: true }}
//             >
//               {file ? (
//                 <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%' }} />
//               ) : (
//                 <Button icon={<UploadOutlined />}>Upload</Button>
//               )}
//             </Upload>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Update
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Modal for displaying product details */}
//       <Modal
//         title="Product Details"
//         open={isModalDetailsVisible}
//         onCancel={handleDetailsCancel}
//         footer={null}
//         destroyOnClose
//       >
//         {selectedProduct && (
//           <div>
//             <Image
//               width={200}
//               src={selectedProduct.image?.url}
//               placeholder={<Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200" width={200} />}
//             />
//             <Row>
//               <Col span={12}><strong>Name:</strong></Col>
//               <Col span={12}>{selectedProduct.title}</Col>
//             </Row>
//             <Row>
//               <Col span={12}><strong>Description:</strong></Col>
//               <Col span={12}>{selectedProduct.description}</Col>
//             </Row>
//             <Row>
//               <Col span={12}><strong>Price:</strong></Col>
//               <Col span={12}>{selectedProduct.price} €</Col>
//             </Row>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default ProductPage;


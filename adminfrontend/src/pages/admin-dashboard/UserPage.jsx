import React, { useEffect } from 'react'
import { useState } from 'react'
import { Table, message } from 'antd';
import { Image } from 'antd';
import axios from 'axios';
import { render } from '@testing-library/react';
import { RiDeleteBin6Line } from "react-icons/ri";

function UserPage() {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleDelete = async (id) => {
    try {
      setUser(user.filter(item => item.id !== id));
      message.success('utilisateur supprimé avec succès');
    } catch (error) {
      message.error('Erreur lors de la suppression du produit');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Last name',
      dataIndex: 'lastename',
      key: 'lastname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
    },
    {
      title: 'Profile Photo',
      dataIndex: 'profilePhoto',
      key: 'profilePhoto',
      render: (_, record) => {
        return (
          <main className="main-content position-ab max-height-vh-100 h-100 border-radius-lg " >

            <Image
              width={50}
              src={record?.profilePhoto.url}
              placeholder={
                <Image
                  preview={false}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                  width={100}
                />

              }
            />
          </main>)
      }
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      render: (_, record) => {
        return (
          <RiDeleteBin6Line
            style={{ fontSize: "20", color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(record.id)}
          />)
      }
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/users/all');
        setUser(response.data);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };

    fetchData()
    console.log(user)

  }, [user]
  )
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>

      <Table dataSource={user} columns={columns} />;

    </div>
  )
}

export default UserPage
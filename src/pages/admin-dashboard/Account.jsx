import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Image } from 'antd';
// import './account.css'; // Fichier CSS personnalisé pour le style

const Account = () => {
    // Récupération des informations de l'utilisateur courant depuis Redux
    const currentUser = useSelector((state) => state.user.currentUser);

    // Si aucune info d'utilisateur n'est trouvée
    if (!currentUser) {
        return <p>Chargement des informations de l'utilisateur...</p>;
    }

    return (
        <div className="account-container">
            <Card title="Votre compte" bordered={false} style={{ width: 300 }}>
                <Row gutter={16}>
                    <Col span={24} className="account-photo">
                        <Image
                            width={100}
                            src={currentUser?.profilePhoto?.url || 'https://via.placeholder.com/100'}
                            alt="Photo de profil"
                        />
                    </Col>
                    <Col span={24} className="account-info">
                        <p><strong>Nom :</strong> {currentUser.name}</p>
                        <p><strong>Email :</strong> {currentUser.email}</p>
                        {/* Ajout d'autres informations comme l'adresse, etc., si nécessaire */}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Account;

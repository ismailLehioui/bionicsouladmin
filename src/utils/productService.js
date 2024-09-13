import axios from 'axios';

const baseUrl = 'http://localhost:3002/api/product';

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${baseUrl}/all`);
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des produits');
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await axios.post(baseUrl + '/', productData);
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de l\'ajout du produit');
    }
};

export const deleteProduct = async (id) => {
    try {
        await axios.delete(baseUrl + `/delete/${id}`);
    } catch (error) {
        throw new Error('Erreur lors de la suppression du produit');
    }
};

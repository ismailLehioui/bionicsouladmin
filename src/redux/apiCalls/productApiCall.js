import { productActions } from "../slices/productSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Get Product Details
export function getProductDetails(productId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/product/${productId}`);
      dispatch(productActions.setProduct(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Add New Product
export function addProduct(product) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post(
        `/product`,
        product,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(productActions.addProduct(data));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Update Product
export function updateProduct(productId, product) {
  return async (dispatch, getState) => {
    try {
      
      const { data } = await request.put(
        `/product/${productId}`,
        product,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(productActions.updateProduct(data));
      toast.success(data.message);
      // setTimeout( ()=> dispatch(productActions.c))
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Delete Product
export function deleteProduct(productId) {
  return async (dispatch, getState) => {
    try {
      dispatch(productActions.setLoading());
      const { data } = await request.delete(
        `/product/delete/${productId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(productActions.deleteProduct(productId));
      toast.success(data.message);
      dispatch(productActions.clearLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(productActions.clearLoading());
    }
  };
}

// Get Products Count (for admin dashboard)
export function getProductsCount() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/product/count`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(productActions.setProductsCount(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Get All Products (for admin dashboard)
export function getAllProducts() {
  return async (dispatch, getState) => {
    try {
      dispatch(productActions.setLoading());

      const { data } = await request.get(
        `/product/all`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(productActions.setProducts(data));
      dispatch(productActions.clearLoading());

    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(productActions.clearLoading());

    }
  };
}

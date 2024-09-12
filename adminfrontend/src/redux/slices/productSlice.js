import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: null,
    loading: false,
    productsCount: null,
    isProductCreated: false,
    products: [],
  },
  reducers: {
    setProduct(state, action) {
      state.product = action.payload;
    },
    addProduct(state, action) {
      state.products.push(action.payload);
    },
    updateProduct(state, action) {
      const index = state.products.findIndex(
        (product) => product._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct(state, action) {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setProductsCount(state, action) {
      state.productsCount = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
  },
});

const productReducer = productSlice.reducer;
const productActions = productSlice.actions;

export { productActions, productReducer };

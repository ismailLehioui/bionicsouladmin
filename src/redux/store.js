import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";                                                                                                                                                                                                                        
import { passwordReducer } from "./slices/passwordSlice";
import { productReducer } from "./slices/productSlice";
import { partnerReducer } from "./slices/partnerSlice";
import { contactReducer } from "./slices/contactSlice";
import { awardReducer } from "./slices/awardSlice";
import { userReducer } from "./slices/userSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        password: passwordReducer,
        product: productReducer,
        partner: partnerReducer,
        contact: contactReducer,
        award: awardReducer,
        user: userReducer

    },
    devTools: true
});

export default store;
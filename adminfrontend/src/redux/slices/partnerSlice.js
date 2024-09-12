import { createSlice } from "@reduxjs/toolkit";

const partnerSlice = createSlice({
    name: "partner",
    initialState: {
        partner: null,
        loading: false,
        partnersCount: null,
        isPartnerCreated: false,
        partners: [],
    },
    reducers: {
        setPartner(state, action) {
            state.partner = action.payload;
        },
        addPartner(state, action) {
            state.partners.push(action.payload);
        },
        updatePartner(state, action) {
            const index = state.partners.findIndex(
                (partner) => partner._id === action.payload._id
            );
            if (index !== -1) {
                state.partners[index] = action.payload;
            }
        },
        deletePartner(state, action) {
            state.partners = state.partners.filter(
                (partner) => partner._id !== action.payload
            );
        },
        setLoading(state) {
            state.loading = true;
        },
        clearLoading(state) {
            state.loading = false;
        },
        setPartnersCount(state, action) {
            state.partnersCount = action.payload;
        },
        setPartners(state, action) {
            state.partners = action.payload;
        },
    },
});

const partnerReducer = partnerSlice.reducer;
const partnerActions = partnerSlice.actions;

export { partnerActions, partnerReducer };

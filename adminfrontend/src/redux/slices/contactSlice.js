import { createSlice } from "@reduxjs/toolkit";

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contact: null,
    loading: false,
    contactsCount: null,
    isContactCreated: false,
    contacts: [],
  },
  reducers: {
    setContact(state, action) {
      state.contact = action.payload;
    },
    deleteContact(state, action) {
      state.contacts = state.contacts.filter(
        (contact) => contact._id !== action.payload
      );
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setContactsCount(state, action) {
      state.contactsCount = action.payload;
    },
    setContacts(state, action) {
      state.contacts = action.payload;
    },
  },
});

const contactReducer = contactSlice.reducer;
const contactActions = contactSlice.actions;

export { contactActions, contactReducer };

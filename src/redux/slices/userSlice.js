import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    usersCount: null,
    isUserCreated: false,
    users: [],
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    addUser(state, action) {
      state.users.push(action.payload);
    },
    updateUser(state, action) {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser(state, action) {
      state.users = state.users.filter(
        (user) => user._id !== action.payload
      );
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setUsersCount(state, action) {
      state.usersCount = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
});

const userReducer = userSlice.reducer;
const userActions = userSlice.actions;

export { userActions, userReducer };

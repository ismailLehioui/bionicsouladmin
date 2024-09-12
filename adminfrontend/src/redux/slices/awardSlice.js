import { createSlice } from "@reduxjs/toolkit";

const awardSlice = createSlice({
  name: "award",
  initialState: {
    award: null,
    loading: false,
    awardsCount: null,
    isAwardCreated: false,
    awards: [],
  },
  reducers: {
    setAward(state, action) {
      state.award = action.payload;
    },
    addAward(state, action) {
      state.awards.push(action.payload);
    },
    updateAward(state, action) {
      const index = state.awards.findIndex(
        (award) => award._id === action.payload._id
      );
      if (index !== -1) {
        state.awards[index] = action.payload;
      }
    },
    deleteAward(state, action) {
      state.awards = state.awards.filter(
        (award) => award._id !== action.payload
      );
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setAwardsCount(state, action) {
      state.awardsCount = action.payload;
    },
    setAwards(state, action) {
      state.awards = action.payload;
    },
  },
});

const awardReducer = awardSlice.reducer;
const awardActions = awardSlice.actions;

export { awardActions, awardReducer };

import { awardActions } from "../slices/awardSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Get Award Details
export function getAwardDetails(awardId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/award/${awardId}`);
      dispatch(awardActions.setAward(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Add New Award
export function addAward(award) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post(
        `/award`,
        award,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(awardActions.addAward(data));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Update Award
export function updateAward(awardId, award) {
  return async (dispatch, getState) => {
    try {
      
      const { data } = await request.put(
        `/award/${awardId}`,
        award,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(awardActions.updateAward(data));
      toast.success(data.message);
      // setTimeout( ()=> dispatch(awardActions.c))
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Delete Award
export function deleteAward(awardId) {
  return async (dispatch, getState) => {
    try {
      dispatch(awardActions.setLoading());
      const { data } = await request.delete(
        `/award/delete/${awardId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(awardActions.deleteAward(awardId));
      toast.success(data.message);
      dispatch(awardActions.clearLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(awardActions.clearLoading());
    }
  };
}

// Get Awards Count (for admin dashboard)
export function getAwardsCount() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/award/count`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(awardActions.setAwardsCount(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Get All Awards (for admin dashboard)
export function getAllAwards() {
  return async (dispatch, getState) => {
    try {
      dispatch(awardActions.setLoading());
      const { data } = await request.get(
        `/award/all`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(awardActions.setAwards(data));
      dispatch(awardActions.clearLoading());

    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(awardActions.clearLoading());

    }
  };
}

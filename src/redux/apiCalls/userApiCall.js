import { userActions } from "../slices/userSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Get User Details
export function getUserDetails(userId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/user/${userId}`);
      dispatch(userActions.setUser(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Add New User
export function addUser(user) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post(
        `/user`,
        user,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(userActions.addUser(data));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Update User
export function updateUser(userId, user) {
  return async (dispatch, getState) => {
    try {
      
      const { data } = await request.put(
        `/user/${userId}`,
        user,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(userActions.updateUser(data));
      toast.success(data.message);
      // setTimeout( ()=> dispatch(userActions.c))
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Delete User
export function deleteUser(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(userActions.setLoading());
      const { data } = await request.delete(
        `/user/delete/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(userActions.deleteUser(userId));
      toast.success(data.message);
      dispatch(userActions.clearLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(userActions.clearLoading());
    }
  };
}

// Get Users Count (for admin dashboard)
export function getUsersCount() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/user/count`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(userActions.setUsersCount(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Get All Users (for admin dashboard)
export function getAllUsers() {
  return async (dispatch, getState) => {
    try {
      dispatch(userActions.setLoading());

      const { data } = await request.get(
        `/user/all`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(userActions.setUsers(data));
      dispatch(userActions.clearLoading());

    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(userActions.clearLoading());

    }
  };
}

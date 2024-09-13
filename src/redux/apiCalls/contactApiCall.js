import { contactActions } from "../slices/contactSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Get Contact Details
export function getContactDetails(contactId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/contact/${contactId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        });
      dispatch(contactActions.setContact(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Delete Contact
export function deleteContact(contactId) {
  return async (dispatch, getState) => {
    try {
      dispatch(contactActions.setLoading());
      const { data } = await request.delete(
        `/contact/delete/${contactId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(contactActions.deleteContact(contactId));
      toast.success(data.message);
      dispatch(contactActions.clearLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(contactActions.clearLoading());
    }
  };
}

// Get Contacts Count (for admin dashboard)
export function getContactsCount() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/contact/count`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(contactActions.setContactsCount(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Get All Contacts (for admin dashboard)
export function getAllContacts() {
  return async (dispatch, getState) => {
    try {

      const { data } = await request.get(
        `contact/all`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(contactActions.setContacts(data));

    } catch (error) {
      // toast.error(error.response.data.message);
      dispatch(contactActions.clearLoading());

    }
  };
}

import { partnerActions } from "../slices/partnerSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Get Partner Details
export function getPartnerDetails(partnerId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/partner/${partnerId}`);
      dispatch(partnerActions.setPartner(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Add New Partner
export function addPartner(partner) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post(
        `/partner`,
        partner,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(partnerActions.addPartner(data));
      toast.success(data.message);
    } catch (error) {
      // console.log(error.response.data.message)
      // toast.error(error.response.data.message);
    }
  };
}

// Update Partner
export function updatePartner(partnerId, partner) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/partner/${partnerId}`,
        partner,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(partnerActions.updatePartner(data));
      toast.success(data.message);
      // setTimeout( ()=> dispatch(partnerActions.c))
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };
}

// Delete Partner
export function deletePartner(partnerId) {
  return async (dispatch, getState) => {
    try {
      dispatch(partnerActions.setLoading());
      const { data } = await request.delete(
        `/partner/delete/${partnerId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(partnerActions.deletePartner(partnerId));
      toast.success(data.message);
      dispatch(partnerActions.clearLoading());
    } catch (error) {
      // toast.error(error.response.data.message);
      dispatch(partnerActions.clearLoading());
    }
  };
}

// Get Partners Count (for admin dashboard)
export function getPartnersCount() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/partner/count`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(partnerActions.setPartnersCount(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Get All Partners (for admin dashboard)
export function getAllPartners() {
  return async (dispatch, getState) => {
    try {
      dispatch(partnerActions.setLoading());

      const { data } = await request.get(
        `partner/all`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(partnerActions.setPartners(data));
      dispatch(partnerActions.clearLoading());

    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(partnerActions.clearLoading());

    }
  };
}

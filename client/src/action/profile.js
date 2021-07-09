import axios from "axios"; // to make request to back-end
import {
  PROFILE_ERROR,
  GET_PROFILE,
  PROFILE_UPDATE,
  DELETE_ACCOUNT,
  GET_ALLPROFILES,
  GET_REPOSITORY,
  PROFILE_CLEAR,
} from "../action/types";
import { setAlert } from "../action/alert";
import setAuthToken from "../utils/setAuthToken";

export const getCurrentProfile = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/profiles/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: PROFILE_CLEAR });
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// create  or profiles
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post("/api/profiles", formData, config);
      dispatch({ type: GET_PROFILE, payload: res.data });

      if (!edit) {
        history.push("/dashboard"); //create a history obj that has the push method to redirect to the dashboard route
      }
      dispatch(
        setAlert(
          edit ? " Profile is updated" : "Profile is created",
          "success",
          5000
        )
      );
    } catch (err) {
      const errors = err.response.data.error;
      if (errors) {
        errors.forEach((err) => {
          dispatch(setAlert(err.msg, "danger", 5000));
        });
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      });
    }
  };
// add Education
export const createEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profiles/education", formData, config);
    dispatch({ type: PROFILE_UPDATE, payload: res.data });

    history.push("/dashboard"); //create a history obj that has the push method to redirect to the dashboard route

    dispatch(setAlert("Education is updated", "success", 5000));
  } catch (err) {
    const errors = err.response.data.error;
    if (errors) {
      errors.forEach((err) => {
        dispatch(setAlert(err.msg, "danger", 5000));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
// add experience
export const createExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profiles/experience", formData, config);
    dispatch({ type: PROFILE_UPDATE, payload: res.data });

    history.push("/dashboard"); //create a history obj that has the push method to redirect to the dashboard route

    dispatch(setAlert("Experience is updated", "success", 5000));
  } catch (err) {
    const errors = err.response.data.error;
    if (errors) {
      errors.forEach((err) => {
        dispatch(setAlert(err.msg, "danger", 5000));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profiles/experience/${id}`);
    dispatch({ type: PROFILE_UPDATE, payload: res.data });
    dispatch(setAlert("You have delete experience", null, 5000));
  } catch (error) {
    const errors = error.response.data.error;
    if (errors) {
      errors.forEach((err) => {
        dispatch(setAlert(err.msg, "danger", 5000));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profiles/education/${id}`);
    dispatch({ type: PROFILE_UPDATE, payload: res.data });
    dispatch(setAlert("You have delete education", null, 5000));
  } catch (error) {
    const errors = error.response.data.error;
    if (errors) {
      errors.forEach((err) => {
        dispatch(setAlert(err.msg, "danger", 5000));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure you want to delete")) {
    try {
      await axios.delete("/api/profiles");

      dispatch({ type: DELETE_ACCOUNT });

      dispatch(setAlert("You have delete Account", null, 5000));
    } catch (error) {
      const errors = error.response.data.error;
      if (errors) {
        errors.forEach((err) => {
          dispatch(setAlert(err.msg, "danger", 5000));
        });
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  }
};
// Display all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: PROFILE_CLEAR });
  try {
    const res = await axios.get("/api/profiles/");

    dispatch({ type: GET_ALLPROFILES, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
// Display  profile match by ID
export const getProfileByID = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profiles/user/${id}`);

    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
export const getGithubRepository = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profiles/github/${username}`);

    dispatch({ type: GET_REPOSITORY, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

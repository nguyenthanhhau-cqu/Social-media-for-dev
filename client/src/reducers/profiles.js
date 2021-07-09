/* eslint-disable import/no-anonymous-default-export */
import {
  GET_PROFILE,
  PROFILE_ERROR,
  PROFILE_CLEAR,
  PROFILE_UPDATE,
  GET_ALLPROFILES,
  GET_REPOSITORY,
} from "../action/types";
const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case GET_PROFILE:
    case PROFILE_UPDATE:
      return {
        ...state, // state is immutable so we have to update state
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state, // state is immutable so we have to update state
        error: payload,
        loading: false,
        profile: null,
      };
    case GET_REPOSITORY:
      return {
        ...state, // state is immutable so we have to update state
        loading: false,
        repos: payload,
      };
    case GET_ALLPROFILES:
      return {
        ...state, // state is immutable so we have to update state
        loading: false,
        profiles: payload,
      };
    case PROFILE_CLEAR:
      return {
        ...state, // state is immutable so we have to update state
        loading: false,
        profile: null,
      };
    default:
      return state;
  }
}

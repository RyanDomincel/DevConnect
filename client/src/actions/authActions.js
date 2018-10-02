import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login - Get user Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/user/login", userData)
    .then(res => {
      //Save to Local Storage
      const { token } = res.data;
      //Set token to Local Storage
      localStorage.setItem("jwt-token", token);
      //Set Token to Auth Header
      setAuthToken(token);
      //decode token to get data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set Login user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user Out
export const logoutUser = () => dispatch => {
  //Remove Token
  localStorage.removeItem("jwtToken");
  //Remove Auth Header
  setAuthToken(false);
  //Set current User to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

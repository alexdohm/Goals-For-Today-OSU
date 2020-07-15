import axios from "axios";
import jwtDecode from "jwt-decode";

export const SET_CURRENT_USER = "SET_CURRENT_USER";
const BASE_URL = "http://localhost:8080";

export function setAuthorizationToken(token) {
  console.log(token);
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

export function signup(userData) {
  return (dispatch) => {
    return axios.post(`${BASE_URL}/auth/signup`, userData);
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem("jwtToken");
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}

export function login(data) {
  return (dispatch) => {
    return axios.post(`${BASE_URL}/auth/login`, data).then((res) => {
      const token = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
    });
  };
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  };
}

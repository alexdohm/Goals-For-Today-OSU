import axios from "axios";
import jwtDecode from "jwt-decode";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

const BASE_URL = `${window.location.protocol}//${window.location.host}`;

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

export const SELECT_TODO = "SELECT_TODO";
export const selectToDo = (toDoID, toDoName, toDoDescription) => ({
  type: SELECT_TODO,
  payload: { toDoID, toDoName, toDoDescription },
});

export const SELECT_USER = "SELECT_USER";
export const selectUser = (userID) => ({
  type: SELECT_USER,
  payload: { userID },
});

export const SELECT_TEAM = "SELECT_TEAM";
export const selectTeam = (teamID) => ({
  type: SELECT_TEAM,
  payload: { teamID },
});

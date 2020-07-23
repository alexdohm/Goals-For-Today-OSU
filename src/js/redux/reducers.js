import { SELECT_TODO } from "./actions";
import { SELECT_USER } from "./actions";
import { SET_CURRENT_USER } from "./actions";

const initialState = {
  selectedToDoId: -1,
  selectedUserId: null,
  isAuthenticated: false,
  user: {},
};

export const toDos = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_TODO: {
      const { toDoID } = payload;
      const newState = {
        ...state,
        selectedToDoId: toDoID,
      };
      return newState;
    }
    case SELECT_USER: {
      const { userID } = payload;
      const newState = {
        ...state,
        selectedUserId: userID,
      };
      return newState;
    }
    default:
      return state;
  }
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !!Object.keys(action.user).length, // turn an empty object into false or an object with keys to be true
        user: action.user,
      };
    default:
      return state;
  }
};

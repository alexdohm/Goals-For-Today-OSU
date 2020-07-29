import {
  SELECT_TODO,
  SELECT_TEAM,
  SELECT_USER,
  SET_CURRENT_USER,
} from "./actions";

const initialState = {
  selectedToDoId: -1,
  selectedToDoName: "General Comments",
  selectedToDoDescription: "",
  selectedUserId: null,
  currentTeam: null,
  isAuthenticated: false,
  user: {},
};

export const toDos = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_TODO: {
      const { toDoID, toDoName, toDoDescription } = payload;
      const newState = {
        ...state,
        selectedToDoId: toDoID,
        selectedToDoName: toDoName,
        selectedToDoDescription: toDoDescription,
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

export const teams = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SELECT_TEAM: {
      const { teamID } = payload;
      const newState = {
        ...state,
        currentTeam: teamID,
      };
      return newState;
    }
    default:
      return state;
  }
};

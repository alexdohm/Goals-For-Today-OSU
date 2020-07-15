import { SELECT_TODO } from './actions';
import { SELECT_USER } from './actions';

const initialState = {
  selectedToDoId: null
}

export const toDos = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_TODO: {
      const { toDoID } = payload;
      const newState = {
        ...state,
        selectedToDoId: toDoID
      };
      return newState;
    }
    case SELECT_USER: {
      const { userID } = payload;
      const newState = {
        ...state,
        selectedUserId: userID
      };
      return newState;
    }
    default:
      return state;
  }
}
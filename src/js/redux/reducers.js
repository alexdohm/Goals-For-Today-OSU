import { SELECT_TODO } from './actions';

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
    default:
      return state;
  }
}
export const SELECT_TODO = 'SELECT_TODO';
export const selectToDo = toDoID => ({
  type: SELECT_TODO,
  payload: { toDoID },
});

export const SELECT_USER = 'SELECT_USER';
export const selectUser = userID => ({
  type: SELECT_USER,
  payload: { userID }
});
export const SELECT_TODO = 'SELECT_TODO';
export const selectToDo = toDoID => ({
  type: SELECT_TODO,
  payload: { toDoID },
});


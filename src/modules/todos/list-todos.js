function makeListTodos({ Todo }) {
  return async function listTodos({ filters = {} }) {
    const lists = await Todo.find({ ...filters, is_deleted: false });

    return lists;
  };
};

module.exports = makeListTodos;
const { NotFoundError } = require("../../shared/errors");

function makeShowTodo({ Todo }) {
  return async function showTodo({ id, user }) {
    const todo = await Todo.findOne({ _id: id, is_deleted: false, user })
      .select("-is_deleted")
      .populate("list", "-is_deleted");

    if (!todo) {
      throw new NotFoundError("Todo topilmadi.");
    };

    return todo;
  };
};

module.exports = makeShowTodo;
const { NotFoundError } = require("../../shared/errors");

function makeRemoveTodo({ Todo }) {
  return async function removeTodo({ id, user }) {
    const existing = await Todo.findOne({ _id: id, is_deleted: false, user });

    if (!existing) {
      throw new NotFoundError("Todo topilmadi.");
    };

    return Todo.findByIdAndUpdate(id, { is_deleted: true }).select("-is_deleted");
  };
};

module.exports = makeRemoveTodo;
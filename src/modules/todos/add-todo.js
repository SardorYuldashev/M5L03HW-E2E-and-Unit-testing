const { NotFoundError } = require("../../shared/errors");

function makeAddTodo({ Todo, List }) {
  return async function addTodo({ list, user, ...rest }) {
    const existingList = await List.findOne({ _id: list, user });

    if (!existingList) {
      throw new NotFoundError("List topilmadi.");
    };

    const result = await Todo.create({ list, user, ...rest });

    existingList.todos.push(result._id);
    existingList.save();

    const { is_deleted, ...other } = result.toObject();

    return other;
  };
};

module.exports = makeAddTodo;
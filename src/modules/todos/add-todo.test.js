const { NotFoundError } = require("../../shared/errors");
const makeAddTodo = require("./add-todo");

describe("Add todo", () => {
  it("agar list mavjud bo'lmasa xatolik qaytishi kerak", () => {
    const Todo = {};

    const List = {
      findOne: jest.fn().mockResolvedValue(null)
    };

    const addTodo = makeAddTodo({ Todo, List });

    const credential = {
      text: "foo",
      list: "bar"
    }

    addTodo(credential).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(List.findOne).toBeCalledTimes(1);
    });
  });
});
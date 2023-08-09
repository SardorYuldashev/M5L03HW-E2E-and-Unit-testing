const { NotFoundError } = require("../../shared/errors");
const makeRemoveTodo = require("./remove-todo");

describe("Remove todo", () => {
  it("agar todo mavjud bo'lmasa xatolik qaytishi kerak", () => {
    const Todo = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const removeTodo = makeRemoveTodo({ Todo });

    removeTodo({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(Todo.findOne).toBeCalledTimes(1);
    });
  });

  it("agar todo o'chirilsa obyekt qaytishi kerak", () => {
    const Todo = {
      findOne: jest.fn().mockResolvedValue({ _id: 1 }),
      findByIdAndUpdate: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ _id: 1, is_deleted: true }),
      })),
    };

    const removeTodo = makeRemoveTodo({ Todo });

    removeTodo({ id: 1 }).then((result) => {
      expect(result).toEqual({ _id: 1, is_deleted: true });
    });
  });
});
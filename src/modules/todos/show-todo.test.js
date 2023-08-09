const { NotFoundError } = require("../../shared/errors");
const makeShowTodo = require("./show-todo");

describe("show-todo", () => {
  it("agar todo topilmasa xatolik qaytarishi kerak", () => {
    const Todo = {
      findOne: jest.fn(() => ({
        select: jest.fn(() => ({
          populate: jest.fn().mockResolvedValue(null)
        }))
      })),
    };

    const showTodo = makeShowTodo({ Todo });

    showTodo({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(Todo.findOne).toBeCalledTimes(1);
    });
  });

  it("agar todo topilsa obyekt qaytarishi kerak", () => {
    const Todo = {
      findOne: jest.fn(() => ({
        select: jest.fn(() => ({
          populate: jest.fn().mockResolvedValue({ name: "First todo" })
        }))
      })),
    };

    const showTodo = makeShowTodo({ Todo });

    showTodo({ id: 1 }).then((result) => {
      expect(result).toEqual({ name: "First todo" });
    });
  });
});
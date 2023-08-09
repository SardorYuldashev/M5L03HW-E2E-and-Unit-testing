const { NotFoundError } = require("../../shared/errors");
const makeEditTodo = require("./edit-todo");

describe("Edit todo", () => {
  it("agar todo mavjud bo'lmasa xatolik qaytishi kerak", () => {
    const Todo = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const editTodo = makeEditTodo({ Todo });

    editTodo({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(Todo.findOne).toBeCalledTimes(1);
    });
  });

  it("agar list mavjud bo'lmasa xatolik qaytishi kerak", () => {
    const Todo = {
      findOne: jest.fn().mockResolvedValue({}),
    };

    const List = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const editTodo = makeEditTodo({ Todo, List });

    editTodo({ id: 1, list: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(Todo.findOne).toBeCalledTimes(1);
      expect(List.findOne).toBeCalledTimes(1);
    });
  });

  it("agar todo tahrirlansa obyekt qaytishi kerak", () => {
    const Todo = {
      findOne: jest.fn().mockResolvedValue({}),
      findByIdAndUpdate: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ _id: 1 }),
      })),
    };

    const List = {
      findOne: jest.fn().mockResolvedValue({}),
    };

    const editTodo = makeEditTodo({ Todo });

    editTodo({ id: 1 }).then((result) => {
      expect(result).toEqual({ _id: 1 });
    });
  });
});
const { NotFoundError } = require("../../shared/errors");
const makeRemoveUser = require("./remove-user");

describe("Remove user", () => {
  it("agar user mavjud bo'lmasa xatolik qaytaradi", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const removeUser = makeRemoveUser({ User });

    removeUser({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
    });
  });

  it("o'chirilgan userni qaytarmaslik kerak", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const removeUser = makeRemoveUser({ User });

    removeUser({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
      expect(User.findOne).toBeCalledWith({ _id: 1, is_deleted: false });
    })
  });

  it("agar user o'chirilsa obyekt qaytishi kerak", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue({ _id: 1 }),
      findByIdAndUpdate: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ _id: 1, is_deleted: true }),
      })),
    };

    const removeUser = makeRemoveUser({ User });

    removeUser({ id: 1 }).then((result) => {
      expect(result).toEqual({ _id: 1, is_deleted: true });
    });
  });
});
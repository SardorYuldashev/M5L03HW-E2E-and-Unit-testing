const { NotFoundError } = require("../../shared/errors");
const makeRemoveList = require("./remove-list");

describe("Remove list", () => {
  it("agar list mavjud bo'lmasa xatolik qaytishi kerak", () => {
    const List = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const removeList = makeRemoveList({ List });

    removeList({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(List.findOne).toBeCalledTimes(1);
    });
  });

  it("agar list o'chirilsa obyekt qaytishi kerak", () => {
    const List = {
      findOne: jest.fn().mockResolvedValue({ _id: 1 }),
      findByIdAndUpdate: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ _id: 1, is_deleted: true }),
      })),
    };

    const removeList = makeRemoveList({ List });

    removeList({ id: 1 }).then((result) => {
      expect(result).toEqual({ _id: 1, is_deleted: true });
    });
  });
});
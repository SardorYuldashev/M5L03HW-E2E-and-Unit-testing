const { NotFoundError } = require("../../shared/errors");
const makeEditList = require("./edit-list");

describe("Edit list", () => {
  it("agar list topilmasa xatolik qaytarishi kerak", () => {
    const List = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const editList = makeEditList({ List });

    editList({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(List.findOne).toBeCalledTimes(1);
    });
  });

  it("agar list tahrirlansa obyekt qaytishi kerak", () => {
    const List = {
      findOne: jest.fn().mockResolvedValue({}),
      findByIdAndUpdate: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ _id: 1 }),
      })),
    };

    const editList = makeEditList({ List });

    editList({ id: 1 }).then((result) => {
      expect(result).toEqual({ _id: 1 });
    });
  });
});
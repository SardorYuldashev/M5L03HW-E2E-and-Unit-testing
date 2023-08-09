const { NotFoundError } = require("../../shared/errors");
const makeShowList = require("./show-list");

describe("Show list", () => {
  it("agar list topilmasa xatolik qaytarishi kerak", () => {
    const List = {
      findOne: jest.fn(() => ({
        select: jest.fn(() => ({
          populate: jest.fn().mockResolvedValue(null)
        }))
      })),
    };

    const showList = makeShowList({ List });

    showList({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(List.findOne).toBeCalledTimes(1);
    });
  });

  it("agar list topilsa obyekt qaytarishi kerak", () => {
    const List = {
      findOne: jest.fn(() => ({
        select: jest.fn(() => ({
          populate: jest.fn().mockResolvedValue({ name: "First list" })
        }))
      })),
    };

    const showList = makeShowList({ List });

    showList({ id: 1 }).then((result) => {
      expect(result).toEqual({ name: "First list" });
    });
  });
});
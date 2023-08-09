const makeListLists = require("./list-lists");

describe("List lists", () => {
  it("agar listlar listi topilsa array qaytishi kerak", () => {
    const List = {
      find: jest.fn().mockResolvedValue([]),
    };

    const listLists = makeListLists({ List });

    listLists({id: 1}).then((result) => {
      expect(result).toEqual([]);
    });
  });
});
const makeListTodos = require("./list-todos");

describe("List todos", () => {
  it("agar todolar listi topilsa array qaytishi kerak", () => {
    const Todo = {
      find: jest.fn().mockResolvedValue([]),
    };

    const listTodos = makeListTodos({ Todo });

    listTodos({id: 1}).then((result) => {
      expect(result).toEqual([]);
    });
  });
});
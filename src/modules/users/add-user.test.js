const makeAddUser = require("./add-user");

describe("Add user", () => {
  it("agar user qo'shilsa obyet qaytishi kerak", () => {
    const User = {
      create: jest.fn().mockResolvedValue({ _id: 1 }),
    };

    const bcryptjs = {
      hash: jest.fn().mockResolvedValue("UUID"),
    };

    const addUser = makeAddUser({ User, bcryptjs });

    const credential = {
      username: "foo_bar",
      password: "1234",
    };

    addUser(credential).then(result => {
      expect(result).toEqual({ _id: 1 });
      expect(User.create).toBeCalledTimes(1);
    });
  });
});
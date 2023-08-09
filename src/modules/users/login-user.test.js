const { UnauthorizedError } = require("../../shared/errors");
const makeLoginUser = require("./login-user");

describe("Login user", () => {
  it("agar user mavjud bo'lmasa xatolik qaytaradi", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const bcryptjs = {};
    const jwt = {};

    const loginUser = makeLoginUser({ User, bcryptjs, jwt });

    loginUser({ id: 1 }).catch((err) => {
      expect(err instanceof UnauthorizedError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
    });
  });

  it("o'chirilgan user login qila olmasligi kerak", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const bcryptjs = {};
    const jwt = {};

    const loginUser = makeLoginUser({ User, bcryptjs, jwt });

    const credential = {
      username: "foo_bar",
      password: "1234",
    };

    loginUser(credential).catch((err) => {
      expect(err instanceof UnauthorizedError).toBe(true);
      expect(User.findOne).toBeCalledWith({ username: "foo_bar", is_deleted: false });
    });
  });

  it("agar password noto'g'ri bo'lsa xatolik qaytaradi", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue({ _id: 1 }),
    };
    const bcryptjs = {
      compare: jest.fn().mockResolvedValue(false),
    };
    const jwt = {};

    const loginUser = makeLoginUser({ User, bcryptjs, jwt });

    const credential = {
      username: "foo_bar",
      password: "1234",
    };

    loginUser(credential).catch((err) => {
      expect(err instanceof UnauthorizedError).toBe(true);
    });
  });

  it("agar password to'g'ri bo'lsa token qaytarishi kerak", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue({ _id: 1 }),
    };
    const bcryptjs = {
      compare: jest.fn().mockResolvedValue(true),
    };
    const jwt = {
      sign: jest.fn(() => 'jwt_token'),
    };
    const loginUser = makeLoginUser({ User, bcryptjs, jwt });

    const credential = {
      username: "foo_bar",
      password: "1234",
    };

    loginUser(credential).then((token) => {
      expect(token).toBe('jwt_token');
    });
  });
});
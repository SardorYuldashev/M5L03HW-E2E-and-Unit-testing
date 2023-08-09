function makeAddUser({ User, bcryptjs }) {
  return async function addUser(data) {
    const hashedPassword = await bcryptjs.hash(data.password, 10);
    const result = await User.create({
      ...data,
      password: hashedPassword,
    });

    return result;
  };
};

module.exports = makeAddUser;
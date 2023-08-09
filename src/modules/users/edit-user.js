const { NotFoundError } = require("../../shared/errors");

function makeEditUser({ User }) {
  return async function editUser({ id, ...changes }) {
    const existing = await User.findOne({ _id: id, is_deleted: false });

    if (!existing) {
      throw new NotFoundError("Foydalanuvchi topilmadi.");
    };

    return User.findByIdAndUpdate(id, changes, { new: true }).select(
      "-password -is_deleted"
    );
  };
};

module.exports = makeEditUser;
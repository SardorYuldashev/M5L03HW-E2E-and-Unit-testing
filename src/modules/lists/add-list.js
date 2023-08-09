function makeAddList({ List }) {
  return async function addList(data) {
    const result = await List.create(data);

    const { is_deleted, ...rest } = result.toObject();

    return rest;
  };
};

module.exports = makeAddList;
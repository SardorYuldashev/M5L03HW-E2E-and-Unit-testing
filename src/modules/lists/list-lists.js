function makeListLists({ List }) {
  return async function listLists({ filters = {} }) {
    const lists = await List.find({ ...filters, is_deleted: false });

    return lists;
  };
};

module.exports = makeListLists;
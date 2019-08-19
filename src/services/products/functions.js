const getAll = (req, res) => {
  res.status(200).json({
    message: 'Hi',
  });
};

const getById = (req, res) => {
  res.status(200).json({
    message: `hi ${req.params.id}`,
  });
};

const addNew = (req, res) => {
  res.status(200).json({
    message: `add new`,
  });
};

const patchById = (req, res) => {
  res.status(200).json({
    message: `update`,
  });
};

const deleteById = (req, res) => {
  res.status(200).json({
    message: `delete`,
  });
};

module.exports = {
  getAll,
  getById,
  addNew,
  patchById,
  deleteById,
};

const ProductModel = require('./model');

const getAll = (req, res) => {
  const { withDeleted } = req.query;

  let query = { is_deleted: false };

  if (withDeleted) {
    delete query.is_deleted
  }

  ProductModel.find({}, (err, result) =>{
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({
      data: result,
    });
  });
};

const getById = (req, res) => {
  const { id } = req.params;
  
  ProductModel.findById(id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({ data: result });
  });
};

const addNew = (req, res) => {
  const { name, price } = req.body;

  ProductModel({ name, price, is_deleted: false })
  .save((err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.status(200).json({ data: result });
  });
};

const patchById = (req, res) => {
  const { id } = req.params;
  const { name, price, is_deleted = false } = req.body;

  ProductModel.findByIdAndUpdate(id, { name, price, is_deleted }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.status(200).json({ data: result });
  });
};

const deleteById = (req, res) => {
  const { id } = req.params;

  ProductModel.findByIdAndUpdate(id, { is_deleted: true }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.status(200).json({ data: result });
  });
};

module.exports = {
  getAll,
  getById,
  addNew,
  patchById,
  deleteById,
};

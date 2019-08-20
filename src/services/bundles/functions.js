const BundleModel = require('./model');

const getAll = (req, res) => {
  const { withDeleted } = req.query;

  let query = { is_deleted: false };

  if (withDeleted) {
    delete query.is_deleted
  }

  BundleModel.find(query, (err, result) =>{
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({
      data: result,
    });
  }).populate('products');
};

const getById = (req, res) => {
  const { id } = req.params;
  
  BundleModel.findById(id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({ data: result });
  }).populate('products');
};

const addNew = (req, res) => {
  const {
    name,
    price,
    duration_in_days,
    quantity,
    is_deleted = false,
    products,
  } = req.body;

  BundleModel({
    name,
    price,
    duration_in_days,
    quantity,
    is_deleted,
    products,
  })
  .save((err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.status(200).json({ data: result });
  });
};

const patchById = (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    duration_in_days,
    quantity,
    is_deleted = false,
    products,
  } = req.body;

  BundleModel.findByIdAndUpdate(id, {
    name,
    price,
    duration_in_days,
    quantity,
    is_deleted,
    products,
  }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.status(200).json({ data: result });
  });
};

const deleteById = (req, res) => {
  const { id } = req.params;

  BundleModel.findByIdAndUpdate(id, { is_deleted: true }, (err, result) => {
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

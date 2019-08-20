const StationModel = require('./model');

const getAll = (req, res) => {
  const { withDeleted, type = "GAS_STATION" } = req.query;

  let query = { is_deleted: false, type};

  if (withDeleted) {
    delete query.is_deleted;
  }

  StationModel.find(query, (err, result) =>{
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({
      data: result,
    });
  })
  .populate('products')
  .populate('facilities');
};

const getByType = (req, res) => {
  const { type = "GAS_STATION" } = req.params;

  let query = {
    type,
  };

  StationModel.find(query, (err, result) =>{
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({
      data: result,
    });
  })
  .populate('products')
  .populate('facilities');
};

const getById = (req, res) => {
  const { id } = req.params;
  
  StationModel.findById(id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({ data: result });
  })
  .populate('products')
  .populate('facilities');
};

const addNew = (req, res) => {
  const {
    name,
    address,
    lat,
    lng,
    open_at,
    closed_at,
    products,
    facilities,
    type,
    is_deleted = false,
  } = req.body;

  StationModel({
    name,
    address,
    lat,
    lng,
    open_at,
    closed_at,
    products,
    type,
    facilities,
    is_deleted,
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
    address,
    lat,
    lng,
    open_at,
    closed_at,
    products,
    type,
    facilities,
    is_deleted = false,
  } = req.body;

  StationModel.findByIdAndUpdate(id, {
    name,
    address,
    lat,
    lng,
    open_at,
    closed_at,
    products,
    type,
    facilities,
    is_deleted,
  }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.status(200).json({ data: result });
  });
};

const deleteById = (req, res) => {
  const { id } = req.params;

  StationModel.findByIdAndDelete(id, { is_deleted: true }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.status(200).json({ data: result });
  });
};

module.exports = {
  getAll,
  getByType,
  getById,
  addNew,
  patchById,
  deleteById,
};

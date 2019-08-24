const ProductModel = require('./model');

const getAll = async (req, res) => {
  try {
    const { withDeleted } = req.query;

    let query = { is_deleted: false };

    if (withDeleted) {
      delete query.is_deleted
    }

    const data = await ProductModel.find(query);

    if (!data && data.length < 0) {
      res.status(400).json({ messages: `product is not exist` });
    }

    res.status(200).json({ data });
  } catch( error ) {
    res.status(500).json({ messages: `${error}` });
  }
};

const getAllByType = async (req, res) => {
  try {
    const { type } = req.params;
  
    const data = await ProductModel.find({ type });
  
    if (!data && data.length <= 0) {
      res.status(404).json({ error: `product with ${type} is not exists` });
    }
  
    res.status(200).json({ data });
  } catch(error) {
    res.status(500).json({ messages: `${error}` });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
  
    const data = await ProductModel.findById(id);

    if (!data) {
      res.status(400).json({ error: `product not exist` });
    }

    res.status(200).json({ data });

  } catch (error) {
    res.status(500).json({ messages: `${error}` });
  }
};

const addNew = async (req, res) => {
  try {
    const {
      name,
      price,
      type,
      descriptions,
      attributes,
    } = req.body;
  
    const data = await ProductModel({
      name,
      price,
      type,
      descriptions,
      attributes,
      is_deleted: false
    })
    .save();

    res.status(200).json({ data });

  } catch(error) {
    res.status(500).json({ error });
  }
};

const patchById = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      type,
      descriptions,
      attributes,
      is_deleted = false,
    } = req.body;

    const product = await ProductModel.findById(id);

    if (!product) {
      res.status(404).json({ error: 'product is not found' });
    }
    
    const data = await ProductModel.findByIdAndUpdate(id, {
      name: name || product.name,
      price: price || product.price,
      type: type || product.type,
      descriptions: descriptions || product.descriptions,
      attributes: attributes || product.attributes,
      is_deleted: is_deleted || product.is_deleted,
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ messages: `${error}` });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProductModel.findByIdAndUpdate(id, { is_deleted: true });
    
    res.status(200).json({ data: deleted });
  } catch (error) {
    res.status(500).json({ error: `error ${error}` });
  }
};

module.exports = {
  getAll,
  getAllByType,
  getById,
  addNew,
  patchById,
  deleteById,
};

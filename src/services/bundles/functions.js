const BundleModel = require('./model');

const getAll = async (req, res) => {
  try {
    const {
      query: {
        withDeleted,
        product,
      },
    } = req;

    let query = {};

    if (product) {
      query = { product }
    }

    const data = await BundleModel.find(query).populate('product');
    
    if (data && data.length > 0) {
      res.status(200).json({ data });
    }

    res.status(200).json({ messages: 'Bundle is empty', data: null })

  } catch (error) {
    res.status(500).json({ messages: `${error} ` });
  }
};

const getById = async (req, res) => {
  try {
    const { params: { id } } = req;
  
    const data = await BundleModel.findById(id).populate('product');
      
    if ( data ) {
      res.status(200).json({ data });
    }

    res.status(200).json({ messages: `Bundle ${id} not exist `, data: null});

  } catch (error) {
    res.status(500).json({ messages: `${error} ` });
  }
};

const addNew = async (req, res) => {
  try {
    const {
      body: {
        name,
        type,
        descriptions,
        price,
        duration_in_days,
        quantity,
        product,
        is_deleted = false,
      }
    } = req;
  
    const data = await BundleModel({
      name,
      type,
      descriptions,
      price,
      duration_in_days,
      quantity,
      product,
      is_deleted,
    }).save();

    if (data) {
      res.status(200).json({ data });
    }

    res.status(422).json({ messages: 'could not create new bundle'});

  } catch (error) {
    res.status(500).json({ messages: `${error} ` });
  }
};

const patchById = async (req, res) => {
  try {
    const {
      params: { id },
      body: {
        name,
        price,
        duration_in_days,
        quantity,
        is_deleted,
        product,
        descriptions,
        type,
      }
    } = req;

    const bundle = await BundleModel.findById(id);

    if (!bundle) {
      res.status(200).json({ messages: `bundle ${id} is not exists`, data: null });
    }
  
    const patched = await BundleModel.findByIdAndUpdate(id, {
      name: name || bundle.name,
      type: type || bundle.type,
      descriptions: descriptions || bundle.descriptions,
      price: price || bundle.price,
      duration_in_days: duration_in_days || bundle.duration_in_days,
      quantity: quantity || bundle.quantity,
      product: product || bundle.product,
      is_deleted: is_deleted || bundle.is_deleted,
    });
    
    if (patched) {
      res.status(200).json({ data: patched });
    }
    
    res.status(422).json({ messages: `could not patch bundle ${id}` });

  } catch (error) {
    res.status(500).json({ messages: `${error} ` });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await BundleModel.findByIdAndRemove(id);
  
    if (result) {
      res.status(200).json({ data: result });
    }
  
    res.status(400).json({ messages: 'Could not remove bundle'});

  } catch(error) {
    res.status(500).json({ messages: `${error}` });
  }
};

module.exports = {
  getAll,
  getById,
  addNew,
  patchById,
  deleteById,
};

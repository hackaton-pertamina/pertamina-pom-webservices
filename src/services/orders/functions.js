const OrderModel = require('./model');
const ProductModel = require('../products/model');

const getAll = async (req, res) => {
  try {
    const { user } = req;
    const { withDeleted } = req.query;
    
    let query = { is_deleted: false, user: user._id };

    if (withDeleted) {
      delete query.is_deleted
    }

    const data = await OrderModel.find(query)
      .populate('products')
      .populate('users')
      .populate('stations');

    if (data.length >= 1) {
      res.status(200).json({ data });
    }

    res.status(404).json({ messages: `you've haven't ordered yet`})

  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
};

const getAllByType = async (req, res) => {
  try {
    const { user } = req;
    const { withDeleted } = req.query;
    const { type } = req.params;
    
    let query = { is_deleted: false, user: user.id, type };

    if (withDeleted) {
      delete query.is_deleted
    }

    const data = await OrderModel.find(query)
      .populate('products')
      .populate('users')
      .populate('stations');

    if (data.length >= 1) {
      res.status(200).json({ data });
    }

    res.status(404).json({ messages: `you've haven't ordered yet`})

  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
};

const getById = async (req, res) => {
  try {
    const { user, params: { id } } = req;
  
    const data = await OrderModel.findById(id)
      .populate('products')
      .populate('stations')
      .populate('user');
    
    if (data) {
      res.status(200).json({ data });
    }

    res.status(404).json({ messages: `You've haven't ordered yet ` });

  } catch(error) {
    res.status(500).json({ error: `${error}` });
  }
};

const addNew = async (req, res) => {
  try {
    const { user, body } = req;
    
    const {
      station,
      subscriptions,
      type = 'PETROL',
      status = 'ON_PROGRESS',
      administrative_cost = 1500,
      is_deleted = false,
      shopping_cart = false,
    } = body;

    const products = await ProductModel.find({
      _id: {
        $all: shopping_cart.map(({ product }) => product),
      }
    });

    let total = 0;

    const cart = products.map(item => {
      const { _id, price, name } = item;

      const current = shopping_cart.find(e => e.product == _id);
      const amount = current.quantity * price;
      
      total += amount;

      return {
        name,
        price,
        amount,
        product: _id,
        quantity: current.quantity,
      };
    });

    total += administrative_cost;

    let name = '';
    
    if (type === 'PETROL') {
      name += '#PT';
    } else if (type === 'SUBSCRIPTION') {
      name += '#SB';
      data.subscriptions = subscriptions;
    } else if (type === 'BOOKING') {
      name += '#SR';
    }

    const data = {
      name,
      amount: total,
      user: user,
      administrative_cost,
      station,
      type,
      status,
      shopping_cart: cart,
      messages: 'new order',
      subscriptions: null,
    };

    const result = await OrderModel(data).save();

    res.status(200).json({ data: result });

  } catch(error) {
    res.status(500).json({ error: `${error}` });
  }
};

const patchById = async (req, res) => {
  const { user, params: { id } } = req;

  if (!id) {
    res.status(422).json({ messages: 'id is not provided' });
  }

  try {
    const result = await OrderModel.findByIdAndUpdate(id, { status: 'PAID'});
    
    if (result) {
      res.status(200).json(result);
    }

    res.status(500).json({ messages: "could not update the data" });
    
  } catch(error) {
    res.status(500).json({ error: `${error}` });
  }

};

const deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await OrderModel.findByIdAndDelete(id);
    res.status(200).json({ data: result });
  } catch(error) {
    res.status(500).json({ error: err });
  }
};

module.exports = {
  getAll,
  getById,
  addNew,
  patchById,
  getAllByType,
  deleteById,
};

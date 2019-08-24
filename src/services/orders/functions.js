const moment = require('moment');
const OrderModel = require('./model');
const ProductModel = require('../products/model');
const SubscriptionModel = require('../subscriptions/model');
const BundleModel = require('../bundles/model');

const getAll = async (req, res) => {
  try {
    const { user } = req;
    const { withDeleted } = req.query;
    
    let query = { is_deleted: false, user: user._id };

    if (withDeleted) {
      delete query.is_deleted
    }

    const data = await OrderModel.find(query)
    .populate('product')
    .populate('station')
    .populate('user');

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
    const {
      user,
      body: {
        station = null,
        bundle = null,
        type = 'PETROL',
        status = 'ON_PROGRESS',
        administrative_cost = 1500,
        is_deleted = false,
        shopping_cart = false,
      }
    } = req;

    let name = '';
    let total = 0;

    let data = {
      user: user._id,
      administrative_cost,
      type,
      station,
      status,
    };
    
    if (type === 'PETROL') {
      name += '#PT';

      const products = await ProductModel.find({
        _id: {
          $all: shopping_cart.map(({ product }) => product),
        }
      });
   
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

      data = {
        ...data,
        name,
        shopping_cart: cart,
      };

    } else if (type === 'SUBSCRIPTION') {
      name += '#SB';

      const selectedBundle = await BundleModel.findById(bundle);
      if (!selectedBundle) {
        res.status(400).json({ error: 'bundle not exists'});
      }

      total += selectedBundle.price;

      const newSubcription = {
        type,
        total,
        bundle: selectedBundle,
        user: user._id,
        expiry: moment().add(selectedBundle.duration_in_days, 'd'),
        balance: selectedBundle.quantity,
        is_deleted: false,
      };

      const savedSubcription = await SubscriptionModel(newSubcription).save();

      if (!savedSubcription) {
        res.status(400).json({ error: 'error when saving subcriptions'});
      }

      data = {
        ...data,
        ...newSubcription,
        name,
      }

    } else if (type === 'BOOKING') {
      name += '#BK';
    }

    total += administrative_cost;

    data = {
      ...data,
      amount: total,
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
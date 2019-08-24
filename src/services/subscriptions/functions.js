const SubscriptionModel = require('./model');

const getAll = async (req, res) => {
  try {
    const {
      user,
      query: {
        withDeleted,
      }
    } = req;

    let query = { is_deleted: false, user: user._id };

    if (withDeleted) {
      delete query.is_deleted
    }

    const data = await SubscriptionModel.find(query)
      .populate('bundle')
      .populate('user')
      ;

    if (!data || data.length <= 0) {
      res.status(400).json({ messages: `subscription is not exist` });
    }

    res.status(200).json({ data });
  } catch( error ) {
    res.status(500).json({ messages: `${error}` });
  }
};

const getAllByType = async (req, res) => {
  try {
    const {
      user,
      params: {
        type
      }
    } = req;

    let query = {
      type,
      user: user._id,
    };
  
    const data = await SubscriptionModel.find(query);
  
    if (!data || data.length <= 0) {
      res.status(200).json({ messages: `subscription with ${type} is not exists`, data: null });
    }
  
    res.status(200).json({ data });
  } catch(error) {
    res.status(500).json({ messages: `${error}` });
  }
};

const getById = async (req, res) => {
  try {
    const {
      user,
      params: { id }
    } = req;

    let query = {
      _id: id,
      user: user._id,
    };
  
    const data = await SubscriptionModel.findOne(query)
    .populate('station')
    .populate('user');

    if (!data) {
      res.status(400).json({ messages: `subscription not exist` });
    }

    res.status(200).json({ data });

  } catch (error) {
    res.status(500).json({ messages: `${error}` });
  }
};

const addNew = async (req, res) => {
  try {
    const {
      user,
      body: { bundle, expiry, balance },
    } = req;
  
    const data = await SubscriptionModel({
      bundle,
      user,
      expiry,
      balance,
      is_deleted: false
    })
    .save();

    res.status(200).json({ data });

  } catch(error) {
    res.status(500).json({ messages: `${error}` });
  }
};

const patchById = async (req, res) => {
  try {
    const {
      params: { id },
      body: {
        bundle,
        expiry,
        balance,
      },
    } = req;

    const subscription = await SubscriptionModel.findById(id);

    if (!subscription) {
      res.status(200).json({ messages: 'subscription is not found', data: null });
    }
    
    const data = await SubscriptionModel.findByIdAndUpdate(id, {
      bundle: bundle || subscription.bundle,
      expiry: expiry || subscription.expiry,
      balance: balance || subscription.balance,
      is_deleted: balance || subscription.is_deleted,
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ messages: `${error}` });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SubscriptionModel.findByIdAndDelete(id);
    
    res.status(200).json({ data: deleted });
  } catch (error) {
    res.status(500).json({ messages: `error ${error}` });
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

const BookingModel = require('./model');

const getAll = async (req, res) => {
  try {
    const {
      query: {
        withDeleted,
      },
    } = req;

    let query = { is_deleted: false };

    if (withDeleted) {
      delete query.is_deleted
    }

    const data = await BookingModel.find(query)
      .populate('products')
      .populate('stations');
    
    if (data && data.length > 0) {
      res.status(200).json({ data });
    }

    res.status(404).json({ messages: 'Booking is empty' })

  } catch (error) {
    res.status(500).json({ messages: `${error} ` });
  }
};

const getById = async (req, res) => {
  try {
    const { params: { id } } = req;
  
    const data = await BookingModel.findById(id)
      .populate('products')
      .populate('stations');
      
    if ( data ) {
      res.status(200).json({ data });
    }

    res.status(404).json({ messages: `Booking ${id} not exist `});

  } catch (error) {
    res.status(500).json({ messages: `${error} ` });
  }
};

const addNew = async (req, res) => {
  try {
    const {
      body: {
        stations,
        products,
        type,
        is_deleted = false,
      }
    } = req;
  
    const data = await BookingModel({
      stations,
      products,
      type,
      is_deleted,
    }).save();

    if (data) {
      res.status(200).json({ data });
    }

    res.status(422).json({ messages: 'could not create new booking'});

  } catch (error) {
    res.status(500).json({ messages: `${error} ` });
  }
};

const patchById = async (req, res) => {
  try {
    const {
      params: { id },
      body: {
        stations,
        products,
        type,
        is_deleted,
      }
    } = req;

    const booking = await BookingModel.findById(id);

    if (!booking) {
      res.status(404).json({ messages: `booking ${id} is not exists` });
    }
  
    const patched = await BookingModel.findByIdAndUpdate(id, {
      stations: stations|| booking.stations,
      products: products|| booking.products,
      type: type|| booking.type,
      is_deleted: is_deleted|| booking.is_deleted,
    });
    
    if (patched) {
      res.status(200).json({ data: patched });
    }
    
    res.status(422).json({ messages: `could not patch booking ${id}` });

  } catch (error) {
    res.status(500).json({ messages: `${error} ` });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await BookingModel.findByIdAndRemove(id);
  
    if (result) {
      res.status(200).json({ data: result });
    }
  
    res.status(400).json({ messages: 'Could not remove booking'});

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

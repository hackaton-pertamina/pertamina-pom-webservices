const StationModel = require('./model');
const geolib = require('geolib');

const getAll = async (req, res) => {
  try {
    const {
      withDeleted,
      lat = null,
      lng = null,
      type = "GAS_STATION"
    } = req.query;
    
    let query = { is_deleted: false };
  
    if (withDeleted) {
      delete query.is_deleted;
    }
  
    const stations = await StationModel.find()
      .populate('products')
      .populate('facilities');

    if (stations && stations.length >= 1) {
      let result = stations;
      // count distances
      if (lat && lng) {
        result = stations.map(station => {
          
          let distance = geolib.getDistance(
            { latitude: lat, longitude: lng },
            {
              latitude: station.lat,
              longitude: station.lng,
            },
            1
          );

          return { ...station._doc, distance: (parseFloat(distance) / 1000) };
        });
      }
      res.status(200).json({ data: result });
    }
    res.status(404).json({ messages: 'Gas stations is not exists' });

  } catch (error) {
    res.status(500).json({ messages: `${error}`});
  }

};

const getByType = (req, res) => {
  const { type = "GAS_STATION" } = req.params;

  let query = {
    type
  };

  StationModel.find(query, (err, result) =>{
    if (err) {
      res.status(500).json({ messages: `${err}`});
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
      res.status(500).json({ messages: `${err}`});
    }

    res.status(200).json({ data: result });
  })
  .populate('products')
  .populate('facilities');
};

const addNew = async (req, res) => {
  try {
    const { 
    body: {
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
    }
  }= req;
  
    const result = await StationModel({
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
    .save();

    if (result) {
      res.status(200).json({ data: result });
    }
    
    res.status(422).json({ messages: `couldn't create new station` });

  } catch (error) {
    res.status(500).json({ messages: `${err}`});
  }
};

const patchById = async (req, res) => {
  try {
    const {
      params: { id },
      body: {
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
      },
    } = req;
  
    const station = await StationModel.findById(id);
  
    if (!station) {
      res.status(400).json({ messages: `station ${id} is not exist !`});
    }
    console.log(products)
    const result = await StationModel.findByIdAndUpdate(id, {
      name: name || station.name,
      address: address || station.address,
      lat: lat || station.lat,
      lng: lng || station.lng,
      open_at: open_at || station.open_at,
      closed_at: closed_at || station.closed_at,
      products: products || station.products,
      type: type || station.type,
      facilities: facilities || station.facilities,
      is_deleted: is_deleted || station.is_deleted,
    });
  
    if (result) {
      res.status(200).json({ data: result });
    }
    
    res.status(422).json({ messages: `error when updating station ${id}`});
    
  } catch (error) {
    res.status(500).json({ messages: `${error}`});
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await StationModel.findByIdAndDelete(id);
  
    if (result) {
      res.status(200).json({ data: result })
    }
  
    res.status(400).json({ messages: `could not delete ${id}`});
    
  } catch(error) {
    res.status(500).json({ messages: `could not delete`});
  }
};

module.exports = {
  getAll,
  getByType,
  getById,
  addNew,
  patchById,
  deleteById,
};

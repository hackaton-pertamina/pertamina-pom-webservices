const geolib = require('geolib');
const moment = require('moment');
const faker = require('faker');

const StationModel = require('./model');

const getAll = async (req, res) => {
  try {
    const {
      lat = null,
      lng = null,
    } = req.query;
  
    const stations = await StationModel.find()
      .populate('products')
      .populate('facilities');

    if (stations && stations.length >= 1) {
      let result = stations;
      // count distances
      if (lat && lng) {
        result = stations.map(station => {

          const is_open = moment().isBefore(moment(station.closed_at, "HH:mm"))
          && moment().isAfter(moment(station.open_at, "HH:mm"));
          
          let distance = geolib.getDistance(
            { latitude: lat, longitude: lng },
            {
              latitude: station.lat,
              longitude: station.lng,
            },
            1
          );

          let nozzles = [];

          const total_nozzles = faker.random.number({ min: 0, max: 12});
          
          for (let i = 0; i < total_nozzles; i++) {
            const total_visitor = faker.random.number({ min: 0, max: 12});
            nozzles.push({
              wait_duration_minutes: (120 * total_visitor) / 60,
              total_visitor,
            })
          }

          // count average waiting time
          let average_wait_duration = 0;
          let sum_wait_duration = 0;
          let total_visitors = 0;

          nozzles.forEach(nozzle => {
            sum_wait_duration += nozzle.wait_duration_minutes;
            total_visitors += nozzle.total_visitor;
          });

          average_wait_duration = sum_wait_duration / nozzles.length;

          return {
            ...station._doc,
            is_open,
            distance: (parseFloat(distance) / 1000),
            total_visitors,
            average_wait_duration,
            nozzles,
          };
        });
      }

      // add waiting time 
      res.status(200).json({
        data: result,
      });
    }
    res.status(200).json({ messages: 'Gas stations is not exists', data: null });

  } catch (error) {
    res.status(500).json({ messages: `${error}`});
  }

};

const getByType = async (req, res) => {
   try {
    const {
      query: {
        withDeleted,
        lat = null,
        lng = null,
      },
      params: {
        type = 'GAS_STATION',
      }
    } = req;
    
    let query = { type };
  
    const stations = await StationModel.find(query)
      .populate('products')
      .populate('facilities');

    if (stations && stations.length >= 1) {
      let result = stations;
      // count distances
      if (lat && lng) {
        result = stations.map(station => {

          const is_open = moment().isBefore(moment(station.closed_at, "HH:mm"))
          && moment().isAfter(moment(station.open_at, "HH:mm"));
          
          let distance = geolib.getDistance(
            { latitude: lat, longitude: lng },
            {
              latitude: station.lat,
              longitude: station.lng,
            },
            1
          );

          return {
            ...station._doc,
            is_open,
            distance: (parseFloat(distance) / 1000),
          };
        });
      }
      res.status(200).json({ data: result });
    }
    res.status(200).json({ messages: 'Gas stations is not exists', data: null });

  } catch (error) {
    res.status(500).json({ messages: `${error}`});
  }

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

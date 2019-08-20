const UserModel = require('./model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
  const {
   username,
   password,
  } = req.body;

  try {
    // encrypt
    const encryptedPassword = await bcrypt.hash(password, 4);
    
    UserModel({ username, password: encryptedPassword, is_deleted: false })
    .save((err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      }
      res.status(200).json({ data: result });
    });

  } catch(error) {
    res.status(500).json({ message: 'error when encrypting password'});
  }
};

const signIn = async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  
  if (!user) {
    res.status(403).json({
      message: 'user not found'
    });
  }

  try {
    // compare hash
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // generate json web token
      const token = jwt.sign({ user }, 'rahasia dong');
      res.status(200).json({
        username: user.username,
        authorization: token,
        type: 'Bearer',
      });
    }

    res.status(403).json({
      message: 'username and password did not match',
    });
    

  } catch(error) {
    res.status(500).json({ message: 'error when comparing hash'});
  }
};

module.exports = {
  signUp,
  signIn,
};

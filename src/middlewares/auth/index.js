const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  const authorization = req.headers['authorization'];

  if (authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7, authorization.length);
    
    if (!token) {
      res.status(403).json({
        messages: 'Forbidden access',
      });
    }

    const decoded = jwt.verify(token, 'rahasia dong');

    if (decoded) {
      req.user = decoded.user;
      next();
    }

  } else {
    res.status(403).json({
      messages: 'Authorization token is must be provided',
    });
  }
};

module.exports = {
  checkToken,
}
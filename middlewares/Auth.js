const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send({ error: 'unauthorized access!' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    console.log(decoded);
    if (!decoded) return res.status(401).send({ error: 'invalid auth token!' })
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ error: 'unauthorized access!' })
  }
}

module.exports = auth;
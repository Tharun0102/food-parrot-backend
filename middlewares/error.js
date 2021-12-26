const error = (err, req, res, next) => {
  // log errors
  console.log("error:", err.message);
  res.status(500).send("something went wrong!");
}

module.exports = error;
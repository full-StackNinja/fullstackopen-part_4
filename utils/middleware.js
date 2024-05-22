const logger = require("./logger");

const requestLogger = (req, res, next) => {
   logger.info("Method:", req.method);
   logger.info("Path:  ", req.path);
   logger.info("Body:  ", req.body);
   logger.info("---");
   next();
};

const unknownEndpoint = (req, res, next) => {
   res.status(404).json({ error: "unkown endpoint" });
};

const errorMiddleware = (err, req, res, next) => {
   logger.error("error.message", err.message);

   if (err.name === "CastError") {
      return res.status(400).json({ error: "Malformatted id" });
   }
   if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
   }
   //    if error is other than above mentioned then move to next error middleware
   next(err);
};

module.exports = {
   errorMiddleware,
   unknownEndpoint,
   requestLogger,
};

const config = require("../utils/config");
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const tokenExtractor = async (req, res, next) => {
   if (req.headers["authorization"]) {
      const token = req.headers["authorization"].split(" ")[1];
      if (!token)
         return res
            .status(401)
            .json({ error: "token is not valid or missing" });
      req.token = token;
   } else {
      console.log("header not provided");
   }
   next();
};

const userExtractor = async (req, res, next) => {
   try {
      if (req.headers["authorization"]) {
         const decodeUser = await jwt.verify(req.token, config.SECRET);
         const user = await User.findOne({ username: decodeUser.username });
         req.user = user;
      } else {
         console.log("header not provided");
      }
      next();
   } catch (error) {
      next(error);
   }
};

const verifyUser = async (req, res, next) => {
   try {
      const user = await jwt.verify(req.token, config.SECRET);
      next();
   } catch (error) {
      next(error);
   }
};

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
   if (err.message.includes("duplicate key error")) {
      return res.status(400).json({ error: "username must be unique" });
   }
   //    if error is other than above mentioned then move to next error middleware
   next(err);
};

module.exports = {
   errorMiddleware,
   unknownEndpoint,
   requestLogger,
   tokenExtractor,
   userExtractor,
   verifyUser,
};

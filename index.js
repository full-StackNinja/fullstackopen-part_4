const express = require("express");
const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const port = config.PORT || 3003;
app.listen(port, () => {
   logger.info(`Server running on port ${port}`);
});

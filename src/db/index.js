const mongoose = require('mongoose');
const config = require('../shared/config');

module.exports = {
  connect() {
    return mongoose
      .connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('DB ga ulandi.');
      })
      .catch((err) => {
        console.log('DB da xatolik: ', err);
      });
  },
  disconnect() {
    return mongoose.disconnect();
  },

  clean() {
    return mongoose.connection.db.dropDatabase()
  }
};
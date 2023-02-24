const { default: mongoose } = require('mongoose');
const dbconnect = () => {
  try {
    mongoose.set('strictQuery', true);
    const con = mongoose.connect(process.env.MONGODB_URL);
    console.log('terkonek dengan database');
  } catch (error) {
    console.log(
      'periksa connect/method/ipaddress mongodb anda benar apa salah'
    );
  }
};
module.exports = dbconnect;

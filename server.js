const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_Password);
// console.log(DB);

mongoose.set('strictQuery', true);

mongoose.connect(DB).then((con) => {
  console.log('DB connected!');
});

// START SERVER
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

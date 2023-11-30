process.on('uncaughtException', (err)=>{
  console.log("Syntax error occurred: ", err);
})
const app = require('./app');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//------------------Config------------------//
dotenv.config({ path: path.join(__dirname, '..', '.env') });
//------------------Listener-----------------//
const port = process.env.PORT || 3000;
const Database = process.env.DATABASE_Connection;
(async function startServer() {
  // Connect with Database
  await mongoose
    .connect(Database)
    .then(console.log('DB connection successful!'));

  // Start the server
  app.listen(process.env.PORT ||port, () => {
    console.log(
      `Server listening on port ${port} in the ${process.env.NODE_ENV} mode`);
  });
  
})();


process.on('unhandledRejection', (err)=>{
  console.log("Error occurred: ",err);
})
// logic to connect to our mongo db using mongoose
/**
 * install npm package mongoose
 * connect using db conn url (present in mongodb compass) 
 */

const mongoose = require("mongoose");



const connectDb = async function(){
    await mongoose.connect("mongodb+srv://varunbudhani:EwYWW8LnF9CAKapZ@namastenode.n2gwq.mongodb.net/devTinder");
    // this will connect to the entire cliuster but if we want to connect specific db we have to specify it ahead of net/ as in this case we have written devTinder so it is our db
    // this returns a promise so it is best to handle it in async await
};

module.exports = connectDb;


// connectDb()
// .then(() => {
//     console.log("Db connected successfully");
// })
// .catch((err) => {
//     console.error("Cannot connect to Database")
// });

// simply doing this will not connect to the db as we are running app.js and not this one so well have to import this file in app.js

// but this is not a good way to connect a db as our server is listening to the calls first and then our db is connected
// to solve this issue we export this connectDb fn in app.js and then run .then .catch there in the app.js file



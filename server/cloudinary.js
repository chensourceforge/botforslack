const cloudinary = require('cloudinary');
const name = "";
const key = "";
const secret = "";

cloudinary.config({ 
  cloud_name: name, 
  api_key: key, 
  api_secret: secret 
});

module.exports = cloudinary;
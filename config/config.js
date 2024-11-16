require('dotenv').config();

const uri = process.env.URI;
const port = process.env.PORT;

module.exports = {
    port,
    uri,
}

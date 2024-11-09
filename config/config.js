const app_name = "fullstackmongo";
const database_name = "fullstackers";
const admin_username = "vrequenaga";
const admin_password = "7Bg2CH5tDepNshab";
const uri = `mongodb+srv://${admin_username}:${admin_password}@${app_name}.mhczk.mongodb.net/${database_name}?retryWrites=true&w=majority&appName=${app_name}`;
const port = 8080;

module.exports = {
    port,
    uri,
}

const { createApp } = require("./app");

const port = Number(process.env.API_PORT || 8080);
const app = createApp();

app.listen(port, function listening() {
  console.log("HELDNAV API http://localhost:" + port + "/v1");
});

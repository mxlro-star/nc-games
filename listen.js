const app = require("./app");
const { PORT = 9090 } = process.env;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`nc_games app listening at http://localhost:${PORT}`);
});

require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;


connectDB();

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}`);
});

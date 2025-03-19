const bcrypt = require("bcrypt");

async function generateSalt() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("1234", salt);
  console.log(salt);
  console.log(hash);
  const hashd = await bcrypt.hash("1234", salt);
  console.log(hashd);
}

generateSalt();

var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const PORT = 3000;
const ListAccount = require("./ListAcount");
const SECRET = "SECRET";

app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send({
        message: "username or password is required",
      });

    // check password
    const user = ListAccount.find(
      (account) =>
        username === account.username && password === account.password
    );
    if (!user) {
      return res.status(404).send({
        message: "user not found",
      });
    }
    const token = await jwt.sign(
      {
        name: user.name,
        age: user.age,
        id: user.id,
      },
      SECRET,
      { expiresIn: 60 * 60 }
    );
    console.log(token);
    res.send({
      token,
    });
  } catch (error) {
    console.log("error ==>", error);
    res.status(500).send({
      error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

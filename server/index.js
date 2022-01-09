const app = require("express")();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = 4000;
const ListAccount = require("./ListAcount");
const SECRET = "SECRET";

var allowedOrigins = [
  // SSO-login
  "http://localhost:5000",
  "http://company.trung:5000",

  "http://localhost:3000", // cho domain ngoại lai
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",

  // alias /etc/hosts
  "http://service.diffent-company.trung:3000",
  "http://service1.company.trung:3001",
  "http://service2.company.trung:3002",
  "http://service3.company.trung:3003",
];

app.use(
  cors({
    credentials: true,
    exposedHeaders: ["set-cookie"],
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

async function guardianMiddleware(req, res, next) {
  try {
    const token = req.headers.setcookie.split("=")[1];
    // fe ko gui cookie qua axios dc
    // const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    const decoded = await jwt.verify(token, SECRET);
    const user = ListAccount.find((account) => account.id === decoded.id);
    if (!user) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    req.authUser = decoded;
    next();
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message: error,
    });
  }
}

app.get("/", guardianMiddleware, async (req, res) => {
  res.status(200).send({
    message: "success",
    user: req.authUser,
  });
});

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
      { expiresIn: 60 * 60 * 60 }
    );
    res.cookie("token", token);
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

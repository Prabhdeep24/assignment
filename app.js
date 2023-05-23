const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const List = require("./models/list");
const authService = require("./services/auth.service");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = 4000;

//DB connection
const sequelize = new Sequelize("demo_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("connection established successfully");
  })
  .catch((err) => {
    console.log("Unable to connect to the database");
  });

// APIS
app.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const users = User.findOne({
        where: { email: email },
      });
      // Login
      if (users) {
        let validpassword = bcrypt.compare(req.body.password, users.password);
        if (validpassword) {
          const token = authService().issue({
            id: users.id,
          });
        }

        return res
          .status(200)
          .json({ status: true, token, users, message: "Login Successfully" });
      }

      // New email
      if (!users) {
        if (req.body.password.length < 8) {
          return res
            .status(400)
            .json({ status: false, message: "Password length should be 8" });
        }
        let salt = await bcrypt.genSalt(10);
        let bcryptPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = User.create({
          email: email,
          password: bcryptPassword,
        });

        const token = authService().issue({
          id: users.id,
        });

        return res.status(200).json({
          status: true,
          data: user,
          token: token,
          message: "User Register Successfully",
        });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

app.post("/list", async (req, res) => {
  try {
    var list = await List.findAll();
    const pagelists = paginatedResults(list);

    // search with title
    if (req.body.title) {
        list = await List.find({where: {title:req.body.title}});
    }
    return res.status(200).json({
      status: true,
      data: pagelists.paginatedResults,
      message: "Data fetched Successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

app.post("/addList", async (req, res) => {
  try {
    const { title, description } = req.body;
    const list = await List.create({
      title: title,
      description: description,
    });

    return res.status(200).json({
      status: true,
      data: list,
      message: "Data fetched Successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

app.put("/markUnmark", async (req, res) => {
  try {
    const { isMark, id } = req.body;
    const list = await List.update(
      {
        isMark: isMark,
      },
      { where: { id: id } }
    );

    return res.status(200).json({
      status: true,
      message: "Data Updated Successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

app.put("/complete", async (req, res) => {
    try {
      const { isComplete, id } = req.body;
      const list = await List.update(
        {
            isComplete: isComplete,
        },
        { where: { id: id } }
      );
  
      return res.status(200).json({
        status: true,
        message: "Data Updated Successfully",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  });

// function for pagination
function paginatedResults(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = model.slice(startIndex, endIndex);

    res.paginatedResults = results;
    next();
  };
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// connection linking with mysql
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "college",
  password: "root",
});

// inserting data into mysql database
// let query = "insert into person(id, name, email, password) values ?";
// let data = [];

// let createRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

// for (let i = 0; i <= 10; i++) {
//   data.push(createRandomUser());
// }

// try {
//   connection.query(query, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

// Performing CRUD with mysql

// This is the R(Read) of the CRUD
app.get("/", (req, res) => {
  let query = "select count(*) from person";
  let count;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      count = result[0]["count(*)"];
    });
  } catch (err) {
    console.log(err);
  }
  query = "select * from person";
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      res.render("show.ejs", { result, count });
    });
  } catch (err) {
    console.log(err);
  }
});

// This is the C(Create) of the CRUD
app.get("/new-account", (req, res) => {
  res.render("createAccount.ejs");
});

app.post("/create-user", (req, res) => {
  let { username, email, password } = req.body;
  let data = [faker.string.uuid(), username, email, password];
  console.log(data);
  let query = "insert into person(id, name, email, password) values (?,?,?,?)";
  try {
    connection.query(query, data, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

// This is the E(Edit) of the CRUD
app.get("/edit-page/:id", (req, res) => {
  let { id } = req.params;
  let message = undefined;
  res.render("edit.ejs", { id, message });
});

app.patch("/edit-info/:id", (req, res) => {
  let { id } = req.params;
  let { username, password } = req.body;
  let query = `select password from person where id="${id}"`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      console.log(result[0]["password"]);
      if (result[0]["password"] == password) {
        query = `update person set name="${username}" where id="${id}"`;
        try {
          connection.query(query, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.redirect("/");
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        let message = "You have Enter an wrong password TRY AGAIN";
        res.render("edit.ejs", { id, message });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// This is the D(Delete) of the CRUD
app.delete("/delete-user/:id", (req, res) => {
  let { id } = req.params;
  let query = `Delete from person where id="${id}" `;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("The server is running of the port 3000");
});
// connection.end();

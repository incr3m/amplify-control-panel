const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");
const app = express();
console.log(">>server/index::", schema, "schema"); //TRACE
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(3001);

// const bodyParser = require("body-parser");

// const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));

// app.get("/api/auth", require("./routes/auth"));

// app.get("/api/greeting", (req, res) => {
//   const name = req.query.name || "World";
//   res.setHeader("Content-Type", "application/json");
//   res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
// });

// app.listen(3001, () =>
//   console.log("Express server is running on localhost:3001")
// );

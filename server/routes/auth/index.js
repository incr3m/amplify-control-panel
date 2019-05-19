const aws = require("aws-sdk");
console.log(">>auth/index::", "aws", aws); //TRACE

module.exports = async (req, res) => {
  console.log(">>auth/index::", "aws", aws); //TRACE
  res.send("Hello");
};

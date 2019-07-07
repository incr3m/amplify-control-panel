const os = require("os");
const path = require("path");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} = require("graphql");
const { getProfileList } = require("./../libs/session");

module.exports = {
  type: new GraphQLList(GraphQLString),
  async resolve() {
    return getProfileList();
  }
};

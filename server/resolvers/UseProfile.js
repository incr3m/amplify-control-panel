const os = require("os");
const fs = require("fs");
const path = require("path");
const {
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} = require("graphql");
const { getProfileList, setSelectedProfile } = require("./../libs/session");

module.exports = {
  type: GraphQLString,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) }
  },
  async resolve(_, { name }) {
    const profiles = getProfileList();
    if (!profiles.includes(name)) throw `Invalid profile name "${name}"`;
    setSelectedProfile(name);
    console.log(">>resolvers/UseProfile::", "used profile: ", name); //TRACE
    return name;
  }
};

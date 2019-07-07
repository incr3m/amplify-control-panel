const os = require("os");
const path = require("path");
const Promise = require("bluebird");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} = require("graphql");
const { getProjectMetaData } = require("../libs/amplify");
// const { getProfileList } = require("./../libs/session");

module.exports = {
  type: GraphQLList(GraphQLString),
  args: {
    projectPaths: { type: GraphQLList(GraphQLString) }
  },
  async resolve(_, { projectPaths = [] }) {
    console.log(">>resolvers/GetProjects::", "projectPaths", projectPaths); //TRACE
    // return getProfileList();
    const projs = await Promise.map(projectPaths, async path => {
      const meta = await getProjectMetaData(path);
      return JSON.stringify(meta || {});
    });
    return projs;
  }
};

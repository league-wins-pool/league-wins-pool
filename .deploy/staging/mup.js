module.exports = {
  servers: {
    one: {
      host: "192.168.33.17",
      username: "vagrant",
      password: "vagrant",
    },
  },

  meteor: {
    name: "winsleague",
    path: "../../",
    servers: {
      one: {},
    },
    buildOptions: {
      debug: true,
    },
    env: {
      ROOT_URL: "http://www.winsleague.com",
      MONGO_URL: "mongodb://localhost/meteor",
      LOGGLY_TOKEN: "",
      ROLLBAR_SERVER_ACCESS_TOKEN: "",
      ROLLBAR_CLIENT_ACCESS_TOKEN: "",
      ROLLBAR_ENVIRONMENT: "staging",
      KADIRA_APP_ID: "",
      KADIRA_APP_SECRET: "",
      MAIL_URL: ""
    },
    dockerImage: "abernix/meteord:node-12.16.1-base",
    deployCheckWaitTime: 60,
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};

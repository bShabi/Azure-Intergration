module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        host: env("DATABASE_HOST", "cluster0.ykcxh.mongodb.net"),
        srv: env.bool("DATABASE_SRV", true),
        port: env.int("DATABASE_PORT", 27017),
        database: env("DATABASE_NAME", "bshabi-updated-db"),
        username: env("DATABASE_USERNAME", "admin"),
        password: env("DATABASE_PASSWORD", "V4onhlu49xhIib3n"),
      },
      options: {
        authenticationDatabase: env("AUTHENTICATION_DATABASE", null),
        ssl: env.bool("DATABASE_SSL", true),
      },
    },
  },
});

// module.exports = ({ env }) => ({
//   defaultConnection: "default",
//   connections: {
//     default: {
//       connector: "mongoose",
//       settings: {
//         host: env("DATABASE_HOST", "127.0.0.1"),
//         srv: env.bool("DATABASE_SRV", false),
//         port: env.int("DATABASE_PORT", 27017),
//         database: env("DATABASE_NAME", "bshabi-strapi-nextjs"),
//         username: env("DATABASE_USERNAME", null),
//         password: env("DATABASE_PASSWORD", null),
//       },
//       options: {
//         authenticationDatabase: env("AUTHENTICATION_DATABASE", null),
//         ssl: env.bool("DATABASE_SSL", false),
//       },
//     },
//   },
// });

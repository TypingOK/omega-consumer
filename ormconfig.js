// eslint-disable-next-line import/no-anonymous-default-export
module.exports = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DATABASE_ID,
  password: process.env.DATABASE_PASSWORD,
  database: "typeorm_tutorial",
  synchronize: false,
  logging: true,
  entities: [
    process.env.NODE_ENV === "production"
      ? "dist/typeorm/entity/*{.ts,.js}"
      : "server/typeorm/entity/*{.ts,.js}",
  ],
  migrations: ["server/typeorm/migration/**/*{.ts,.js}"],
  subscribers: ["server/typeorm/subscriber/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "typeorm/entity",
    migrationsDir: "typeorm/migration",
    subscribersDir: "typeorm/subscriber",
  },
};

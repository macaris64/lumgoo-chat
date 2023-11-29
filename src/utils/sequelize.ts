import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.POSTGRES_DB!,
  process.env.POSTGRES_USER!,
  process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    dialect: 'postgres',
    logging: console.log, // set to true if you want to see SQL logs
    // additional configuration can be set here (like pool settings)
});

export default sequelize;

import {Sequelize} from 'sequelize';

const DB = new Sequelize('app', '', '',{
    storage: './database.sqlite',
    dialect: 'postgres',
    logging: false
});

export default DB;
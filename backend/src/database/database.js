import mysql from 'promise-mysql';
import config from '../config';

const connection = mysql.createConnection({
    host:config.host,
    database:config.databse,
    user:config.user,
    password:config.password
});

const getConnection = () => {
    return connection;
}

module.exports = {
    getConnection
}
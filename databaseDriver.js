const { Sequelize, DataTypes } = require("sequelize");
const {
    db_host,
    db_passwd,
    db_user,
    db_port,
    db_name
} = require('./configuration/access_config.json')[global.env]; // TODO: You know

function init() {
    const sequelize = new Sequelize(db_name, db_user, db_passwd, {
        host: db_host,
        dialect: 'mysql',
        port: db_port,
        logging: false
    });

    sequelize.define('Movie', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imdbid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usertag: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        guild: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: 'movies'
    });

    sequelize.define('Viewed', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imdbid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        guild: {
            type: DataTypes.STRING,
            allowNull: false
        },
        viewedDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'viewed'
    });

    sequelize.define('State', {
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        }
    }, {
        tableName: 'states'
    });

    sequelize.sync();
    global.db = sequelize;
}

module.exports = { init };
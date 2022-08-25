const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize('robot_gowner', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
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

// const movielist = require('./lists/movies.json')['907197915708162098']['movies'];

// for (let i in movielist) {
//     movielist[i].guild = '907197915708162098';
//     sequelize.models.Movie.create(movielist[i])
// }

// const states = require('./states.json');

// for (let i in states) {
//     sequelize.models.State.create({
//         state: i,
//         data: states[i]
//     })
// }

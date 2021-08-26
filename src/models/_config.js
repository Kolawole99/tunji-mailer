/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

require('dotenv').config();
const glob = require('glob');
const { resolve } = require('path');
const mongoose = require('mongoose');

const { APP_DB_URI } = process.env;

module.exports.connect = () => {
    try {
        mongoose.connect(
            APP_DB_URI,
            {
                autoIndex: false,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            (err, data) => {
                if (err) {
                    console.log('Could not connect to database');
                    return;
                }
                if (data) console.log('Database connection established.');
            }
        );
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
    }
};

module.exports.loadModels = () => {
    const basePath = resolve(__dirname, '../models/');
    const files = glob.sync('*.js', { cwd: basePath });
    files.forEach((file) => {
        if (file.toLocaleLowerCase().includes('_config')) return;
        // eslint-disable-next-line
        require(resolve(basePath, file));
    });
};

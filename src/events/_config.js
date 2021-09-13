/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */
const EventEmitter = require('events');
const { logger } = require('../utilities/logger');

class AppEvent extends EventEmitter {}
const appEvent = new AppEvent();

appEvent.on('error', (error) => {
    logger.error(`[AppEvent Error] ${error}`);
});

appEvent.on('sampleEventName', (param) => {
    console.log(param);
});

module.exports = appEvent;

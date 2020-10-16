const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(winston.format.prettyPrint()),
    defaultMeta: { service: 'user-service' },
    transports: [
        // transport are the storage devices eg db, file
        new winston.transports.File({ filename: `./logs/error.log`, level: 'error' }),
        new winston.transports.Console()
    ]
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
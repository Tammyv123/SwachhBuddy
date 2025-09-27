import winston from 'winston'

const timestampFormat = {
    format: 'YYYY-MM-DD HH:mm:ss',
}

// ANSI escape codes for tomato coloring the timestamp
const colorFormat = (data: any): string =>
    `\x1b[38;5;203m${data.timestamp}\x1b[0m ${data.level}: ${data.message}`

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(timestampFormat),
        winston.format.colorize(),
        winston.format.printf(colorFormat)
    ),
    transports: [new winston.transports.Console()],
})

export default logger

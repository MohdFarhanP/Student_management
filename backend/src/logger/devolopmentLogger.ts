const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf,colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp}   ${message}`;
});

const devolopmentLogger = ()=> {
  return createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({format:'HH:mm:ss'}),
    myFormat
  ),
  transports: [
    new transports.Console()
  ],
});
}
export default devolopmentLogger;
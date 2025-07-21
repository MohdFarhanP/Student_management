const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf,colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp}  ${message}`;
});

const productionLogger = () =>{
  return createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'myErrors.log',}), 
  ],
});
}
export default productionLogger;
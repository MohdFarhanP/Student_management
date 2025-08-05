import devolopmentLogger from './devolopmentLogger';
import productionLogger from './productionLogger';
let logger = null;

if (process.env.NODE_ENV !== 'production') {
  logger = devolopmentLogger();
}
if (process.env.NODE_ENV === 'production') {
  logger = productionLogger();
}

export default logger;

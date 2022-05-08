const { createLogger, format, transports } = require('winston');
const path = require('path');
const mt = require('moment-timezone');
const date = mt().tz('Asia/Seoul');
const koreaTime = format((info) => {
  info.timestamp = date.format();
  return info
});

const appLogger = createLogger({ // NOTE: application 로그를 남기기 위함.
  format: format.combine(
    format.timestamp({
      format: 'YY-MM-DD HH:mm:ss'
    }), 
    format.splat(),
    format.printf(({ 
      level, 
      message 
    }) => `${level}: ${message}`),
    format.json()
  ),
  transports: [
    new transports.File({ 
      filename: path.join('log', 'app-error.log'), 
      level: 'error' 
    }), // NOTE: 에러는 별도로 보기 위함
    new transports.File({ 
      filename: path.join(`log`, date.format('YY-MM-DD'), 'app.log') 
    }), // NOTE: 모든 로그 (에러 포함)
    new transports.Console()
  ],
  });


const httpLogger = createLogger({ // NOTE: http status 로그를 남기기 위함.
  format: format.combine(
    format.timestamp({
      format: 'YY-MM-DD HH:mm:ss'
    }), 
    format.splat(),
    format.printf(({ 
      level, 
      message 
    }) => `${level}: ${message}`)
  ),
  transports: [
    new transports.File({ 
      filename: path.join('log', date.format('YY-MM-DD'), 'http.log') 
    }),
    new transports.Console()
  ],
});

const httpLogStream = {
  write: (message) => { // NOTE: morgan에서 쓰기 위해 이 형태로 fix 되야함.
    httpLogger.log({
      level: 'info',
      message: message,
    });
  },
};

export default { 
  appLogger, 
  httpLogStream 
}
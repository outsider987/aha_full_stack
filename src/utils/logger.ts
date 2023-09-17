import {createHash, randomInt} from 'crypto';
import * as moment from 'moment-timezone';

const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m', // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

export const generateRequestId = (request) => {
  return createHash('sha512')
      .update(process.hrtime() + '|' + request.ip + '|' + randomInt(999999999))
      .digest('hex')
      .substring(0, 8);
};

export const event = (content) => {
  const log = {
    dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    requestId: global.requestId,
    content,
  };
  console.log(JSON.stringify(log));
};

export const localLog = (message) => {
  let logContent = colours.fg.green + new Date().toLocaleString() +
                    colours.fg.yellow + '\t[' + global.requestId + ']' +
                    colours.reset;
  if (Array.isArray(message)) {
    message.forEach((m) => {
      switch (typeof m) {
        case 'string':
          logContent += '\t' + m;
          break;
        case 'object':
          logContent += '\t' + colours.fg.magenta +
           JSON.stringify(m) + colours.reset;
          break;
      }
    });
  } else {
    logContent = message;
  }
  console.log(logContent);
};

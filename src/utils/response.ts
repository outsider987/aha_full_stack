import constants from '../config/constants';

export const successResponse = (response: Record<any, any> = []) => {
  const isArray = Array.isArray(response);
  return {
    success: true,
    requestId: global.requestId,
    data: isArray ? [...response] : response
  };
};

export const failureResponse = (
  message: string | [],
  code: string,
  remarks?
) => {
  const lang = constants.lang[global.localeKey.toLowerCase()];
  if (typeof message === 'string') {
    message += ` (${lang.ERROR_CODE}: ${code}, 
      ${lang.REFERENCE_CODE}: ${global.requestId})`;
    if (
      remarks &&
      remarks.ResponseCode &&
      remarks.ResponseEngMessage &&
      remarks.ResponseChiMessage
    ) {
      switch (lang) {
        case 'en':
          message += ` 
          ${lang.INSURER_MESSAGE}: 
          ${remarks.ResponseEngMessage} 
          (${remarks.ResponseCode})`;
          break;
        case 'cn':
          message += ` 
          ${lang.INSURER_MESSAGE}:
           ${remarks.ResponseChiMessage} 
           (${remarks.ResponseCode})`;
          break;
      }
    }
  }
  return {
    success: false,
    requestId: global.requestId,
    error: {
      message,
      code
    },
    remarks
  };
};

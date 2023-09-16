export const successResponse = (response: Record<string, any> = []) => {
    // we could make resposne format at here insteand of pararm of key in object
    const datas = Array.isArray(response) ? 'items' : 'data';
    return {
        success: true,
        requestId: global.requestId,
        ...response,
        // [datas]: response,
    };
};

export const successResponse = (response: Record<string, any> = []) => {
    return {
        success: true,
        requestId: global.requestId,
        ...response,
    };
};

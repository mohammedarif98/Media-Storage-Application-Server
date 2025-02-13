

function ApiError(message, statusCode) {
    const error = new Error(message);  
    error.statusCode = statusCode;
    error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    error.isOperational = true;

    Error.captureStackTrace(error, ApiError);
    return error;  
}
  

export default ApiError;
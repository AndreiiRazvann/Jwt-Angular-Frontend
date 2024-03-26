export interface CustomHttpResponse { //the custom httpResponse for when the user its changing its password for example
    httpStatusCode: number;
    httpStatus: string;
    reason: string;
    message: string;
}
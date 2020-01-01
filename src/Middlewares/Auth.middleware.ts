import { Request, Response, NextFunction } from "express";
import AuthException from "../Exceptions/AuthException";
import { extractInfo } from "../utils/tokens";

class AuthMiddleware {
    private AuthExceptionHandler = new AuthException();
    //verify if token is there
    //if there then extract and add to request object
    //else throw excption
    public constructor() {}
    public middleware = (request: Request, response: Response, next: NextFunction): void => {
        if (request.headers.authorization && request.headers.authorization.split(" ")[1]) {
            this.handleRequest(request, response, next);
        } else {
            this.AuthExceptionHandler.missingToken(request, response);
        }
    };

    private handleRequest(request: Request, response: Response, next: NextFunction): void {
        const authToken = request.headers.authorization.split(" ")[1];
        //extact and attach th required data to request
        const extractedData = extractInfo(authToken);
        if (extractedData) {
            //token is valid and go through
            response.locals.userInfo = extractedData;
            next();
        } else this.AuthExceptionHandler.invalidToken(request, response);
        //check token time is valid else through exception
    }
}

export default AuthMiddleware;

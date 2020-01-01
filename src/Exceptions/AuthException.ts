import { Request, Response } from "express";

class AuthException {
    public constructor() {}
    public invalidPassword(): void {}
    public invalidUsername(): void {}
    public missingToken(request: Request, response: Response): void {
        response.status(400).json({ success: false, errMsg: "missingToken" });
    }
    public invalidToken(request: Request, response: Response): void {
        response.status(400).json({ success: false, errMsg: "invalid Token" });
    }
}

export default AuthException;

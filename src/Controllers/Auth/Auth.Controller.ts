import { Router, Request, Response } from "express";
import { ValidationChain, check, validationResult } from "express-validator";
import userModel from "../../Models/User.Model";
import { generateToken } from "../../utils/tokens";
import Hashing from "../../utils/hashing";

class AuthController {
    public path: string = "/auth";
    public router: Router = Router();
    private HashingClass: Hashing = new Hashing();

    public constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes(): void {
        this.router.post("/register", this.validateRegisterUser, this.registerUser);
        this.router.post("/login", this.validateLoginUser, this.loginUser);
    }

    private validateRegisterUser: ValidationChain[] = [
        check("email").isEmail(),
        check("password").exists(),
        check("firstName").exists(),
        check("lastName").exists(),
    ];

    private registerUser = (request: Request, response: Response): void => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return null;
        }
        const { password } = request.body;
        const hash = this.HashingClass.generateHash(password);
        const createdUser = new userModel({ ...request.body, password: hash });
        createdUser
            .save()
            .then((user): void => {
                response.json({
                    success: true,
                    data: { token: generateToken(user), user },
                });
            })
            .catch((err): void => {
                response.status(400).json({ success: false, err });
            });
    };

    private validateLoginUser: ValidationChain[] = [check("email").isEmail(), check("password").exists()];

    private loginUser = (request: Request, response: Response): void => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return null;
        }
        userModel
            .findOne({ email: request.body.email })
            .then((user): void => {
                if (this.HashingClass.compareHash(request.body.password, user.password)) {
                    response.json({ success: true, data: { token: generateToken(user), user } });
                } else {
                    response.status(403).json({ success: false, errMSg: "Invalid Password" });
                }
            })
            .catch((err): void => {
                response.status(400).json({ success: false, errMsg: "user not found", err });
            });
    };
}

export default AuthController;

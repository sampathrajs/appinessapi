import { UserId } from "../../Interfaces/User.Interface";
import { Router, Request, Response, RequestHandler } from "express";
import { ValidationChain, check, validationResult } from "express-validator";
import userModel from "../../Models/User.Model";

class UserController {
    public path: string = "/budget";
    public router: Router = Router();
    private middlewares: RequestHandler[];

    public constructor(middlewares: RequestHandler[] = []) {
        this.middlewares = middlewares;
        this.intializeMiddlewares();
        this.intializeRoutes();
    }

    private intializeMiddlewares(): void {
        this.middlewares.forEach((middleware): void => {
            this.router.use(middleware);
        });
    }

    private intializeRoutes(): void {
        this.router.post("/", this.validateSaveBudget, this.saveBudget);
        this.router.get("/", this.getBudget);
    }

    private validateSaveBudget: ValidationChain[] = [
        check("budget")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
    ];

    private saveBudget(request: Request, response: Response): void {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return null;
        }
        const budget: number = request.body.budget;
        const userId: UserId = response.locals.userInfo.id;
        //save budget in user document
        userModel
            .findByIdAndUpdate(userId, { budget })
            .then((value): void => {
                if (value) {
                    //success
                    response.json({ success: true, budget });
                } else {
                    response.status(403).json({ success: false, erMsg: "id in token invalid" });
                    //invalid token
                }
            })
            .catch((err): void => {
                response.status(400).json({ errMsg: "backend error", err });
            });
    }

    private getBudget = (request: Request, response: Response): void => {
        const userId: UserId = response.locals.userInfo.id;
        userModel
            .findById(userId)
            .then((doc): void => {
                response.json({ budget: doc.budget, success: true });
            })
            .catch((err): void => {
                response.json({ err, errMsg: "something went wrong", success: false });
            });
    };
}

export default UserController;

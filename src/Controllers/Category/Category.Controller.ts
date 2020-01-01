import { UserId } from "../../Interfaces/User.Interface";
import { Router, Request, Response, RequestHandler } from "express";
import categoryModel from "../../Models/Category.Model";
import { CategoryInterface } from "../../Interfaces/Category.Interface";
import { check, ValidationChain, validationResult } from "express-validator";
import ControllerInterface from "../../Interfaces/Controller.Interface";

class CategoryController implements ControllerInterface {
    public path: string = "/category";
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
        this.router.get("/", this.getAllCategories);
        this.router.delete("/", this.validateDeleteCategory, this.deleteCategory);
        this.router.put("/", this.validatePutCategory, this.putCategory);
        //need update category
    }

    private validatePutCategory: ValidationChain[] = [
        check("name")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
    ];

    private putCategory = (request: Request, response: Response): void => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return null;
        }
        const user: UserId = response.locals.userInfo.id;
        const categoryData: CategoryInterface = { ...request.body, user };
        const createdCategory = new categoryModel(categoryData);
        createdCategory
            .save()
            .then((savedCategory): void => {
                response.json({ success: true, data: savedCategory });
            })
            .catch((error): void => {
                response.status(400).json({ success: false, errmsg: "could not save", error });
                console.log(error);
            });
    };

    private getAllCategories = (_request: Request, response: Response): void => {
        categoryModel
            .find({ user: response.locals.userInfo.id })
            .then((data: CategoryInterface[]): CategoryInterface[] =>
                data.filter((category): boolean => !category.isDeleted),
            )
            .then((data): void => {
                response.json({ success: true, data: data });
            })
            .catch((err): void => {
                response.status(400).json({ success: false, errMsg: "Internal error", err });
            });
    };

    private validateDeleteCategory: ValidationChain[] = [
        check("id")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
    ];

    private deleteCategory = (request: Request, response: Response): void => {
        // TODO:  Validatng token id and user missing
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return null;
        }
        categoryModel
            .findByIdAndUpdate(request.body.id, { isDeleted: true })
            .then((data): void => {
                if (data.isDeleted) {
                    response.json({ success: false, err: "Already deleted" });
                } else response.json({ success: true, data });
            })
            .catch((err): void => {
                response.status(400).json({ success: false, err });
            });
    };
}

export default CategoryController;

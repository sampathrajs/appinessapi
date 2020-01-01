import { UserId } from "../../Interfaces/User.Interface";
import { Router, Request, Response, RequestHandler } from "express";
import { ExpenseInterface } from "../../Interfaces/Expense.Interface";
import expenseModel from "../../Models/Expense.Model";
import { check, ValidationChain, validationResult } from "express-validator";

class ExpensesController {
    public path: string = "/expenses";
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
        this.router.get("/", this.getAllExpenses);
        this.router.put("/", this.validateUpdateExpense, this.updateExpense);
        this.router.delete("/", this.validateDeleteExpense, this.deleteExpense);
        this.router.post("/", this.validateSaveExpense, this.saveExpense);
        this.router.get("/deleted", this.getDeletedExpenses);
    }

    private getExpenses = (needDeleted: boolean, response: Response): void => {
        const user: UserId = response.locals.userInfo.id;
        expenseModel
            .find({ user })
            .populate("category")
            .then((data: ExpenseInterface[]): ExpenseInterface[] =>
                data.filter((expense: ExpenseInterface): boolean => needDeleted === expense.isDeleted),
            )
            .then((data: ExpenseInterface[]): void => {
                response.json({ success: true, data });
            })
            .catch((err): void => {
                response.json({ success: false, err });
            });
    };

    private getAllExpenses = (_request: Request, response: Response): void => {
        this.getExpenses(false, response);
    };

    private getDeletedExpenses = (_request: Request, response: Response): void => {
        this.getExpenses(true, response);
    };

    private validateSaveExpense: ValidationChain[] = [
        //TODO: More validation type checking required
        check("category")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
        check("name")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
        check("amount")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
        check("expenseDate")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
    ];
    private saveExpense(request: Request, response: Response): void {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return null;
        }
        const user: UserId = response.locals.userInfo.id;
        const expenseData: ExpenseInterface = request.body;
        const createdExpense = new expenseModel({ ...expenseData, user });
        createdExpense
            .save()
            .then((savedExpense): void => {
                response.json({ success: true, data: savedExpense });
            })
            .catch((err): void => {
                response.status(400).json({ success: false, err });
            });
    }

    private validateDeleteExpense: ValidationChain[] = [
        check("id")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
    ];

    private deleteExpense(request: Request, response: Response): void {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return null;
        }
        const id = request.body.id;
        expenseModel
            .findByIdAndUpdate(id, { isDeleted: true })
            .then((data): void => {
                if (data.isDeleted) {
                    response.json({ success: false, err: "Already deleted" });
                } else response.json({ success: true, data });
            })
            .catch((err): void => {
                response.status(400).json({ success: false, err });
            });
    }

    private validateUpdateExpense: ValidationChain[] = [
        //TODO: More validation type checking required
        check("category")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
        check("name")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
        check("amount")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
        check("expenseDate")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
        check("_id")
            .exists({ checkNull: true })
            .withMessage("Param Missing"),
    ];
    private updateExpense(request: Request, response: Response): void {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return null;
        }
        expenseModel
            .findByIdAndUpdate(request.body._id, { ...request.body }, { new: true })
            .then((data: ExpenseInterface): void => {
                response.json({ success: true, data });
            })
            .catch((err): void => {
                response.status(400).json({ success: false, err });
            });
    }
}

export default ExpensesController;

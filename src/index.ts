import "dotenv/config";
import validateEnv from "./utils/validateEnv";
validateEnv();

import App from "./app";
import AuthController from "./Controllers/Auth/Auth.Controller";
import CategoryController from "./Controllers/Category/Category.Controller";
import ExpensesController from "./Controllers/Expenses/Expenses.Controller";
import AuthMiddleware from "./Middlewares/Auth.middleware";
import { RequestHandler } from "express";
import UserController from "./Controllers/Budget/Budget.Controller";

const authMiddleware: RequestHandler = new AuthMiddleware().middleware;

const app = new App({
    controllers: [
        new AuthController(),
        new CategoryController([authMiddleware]),
        new ExpensesController([authMiddleware]),
        new UserController([authMiddleware]),
    ],
});

app.listen();

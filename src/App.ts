import * as express from "express";
import { connect as MongooseConnect } from "mongoose";
import AppInterface from "./Interfaces/App.Interface";
import ControllerInterface from "./Interfaces/Controller.Interface";
import * as cors from "cors";

class App {
    public app: express.Application;
    public port: number;
    //controllers: Controller[], port?: number
    public constructor({ controllers, port }: AppInterface) {
        this.connectToTheDatabase();
        //TODO: wait for db connection to complete else throow error
        this.app = express();
        this.port = port || parseInt(process.env.PORT);
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private connectToTheDatabase(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB_NAME } = process.env;
        MongooseConnect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}${MONGO_DB_NAME}?retryWrites=true`, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    }

    private initializeMiddlewares(): void {
        //all the middlewares
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeControllers(controllers: ControllerInterface[]): void {
        controllers.forEach((controller: ControllerInterface): void => {
            this.app.use(controller.path, controller.router);
        });
    }

    public listen(): void {
        this.app.listen(this.port, (): void => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;

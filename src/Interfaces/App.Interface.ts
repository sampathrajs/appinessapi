import Controller from "./Controller.Interface";

interface AppInterface {
    controllers: Controller[];
    port?: number;
}

export default AppInterface;

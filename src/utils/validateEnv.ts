import { cleanEnv, str, port, num } from "envalid";

function validateEnv(): void {
    cleanEnv(process.env, {
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        MONGO_DB_NAME: str(),
        PORT: port(),
        TOKEN_SECRET: str(),
        HASHING_SALT: num(),
    });
}

export default validateEnv;

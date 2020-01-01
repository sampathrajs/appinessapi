import * as bcrypt from "bcryptjs";

export default class Hashing {
    public generateHash(data: string): string {
        const salt = bcrypt.genSaltSync(parseInt(process.env.HASHING_SALT));
        const hash = bcrypt.hashSync(data, salt);
        return hash;
    }

    public compareHash(data1: string, hash: string): boolean {
        return bcrypt.compareSync(data1, hash);
    }
}

import {compare, hash} from "bcrypt";

export class PasswordManager {
    static async toHash(password: string) {
        return await hash(password, 8);
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        return await compare(suppliedPassword, storedPassword);
    }
}
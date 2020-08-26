import { injectable } from "inversify";

import { UsersRepository } from "../repositories/users.repository";
import { DocumentUser, User } from "../models/user.model";

@injectable()
export class UsersService {
    constructor(private _usersRepository: UsersRepository) {}

    public async createUser(user: User): Promise<DocumentUser> {
        return this._usersRepository.createUser(user);
    }
    public async findByID(id: string): Promise<DocumentUser> {
        return this._usersRepository.findUserById(id);
    }

    public async findUserByEmail(email: string): Promise<DocumentUser> {
        return this._usersRepository.findUserByEmail(email);
    }

    public async findUserByUsername(username: string): Promise<DocumentUser> {
        return this._usersRepository.findUserByUsername(username);
    }

    public async findByName(searchValue: string): Promise<DocumentUser[]> {
        return this._usersRepository.findByName(searchValue);
    }
}

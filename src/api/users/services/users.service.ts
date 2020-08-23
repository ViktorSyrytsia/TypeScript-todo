import { injectable } from "inversify";

import { UsersRepository } from "../repositories/users.repository";
import { DocumentUser, User } from "../models/user.model";

@injectable()
export class UsersService {
  constructor(private _usersRepository: UsersRepository) {}

  public async createUser(user: User): Promise<DocumentUser> {
    return this._usersRepository.repository.create(user);
  }

  public async findUserByEmail(email: string): Promise<DocumentUser> {
    return this._usersRepository.repository.findOne({ email: email });
  }

  public async findUserByUsername(username: string): Promise<DocumentUser> {
    return this._usersRepository.repository.findOne({ username: username });
  }

  public async findByName(searchValue: string): Promise<DocumentUser[]> {
    return searchValue
      ? this._usersRepository.repository.find({
          $or: [
            {
              firstName: {
                $regex: searchValue,
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: searchValue,
                $options: "i",
              },
            },
          ],
        })
      : this._usersRepository.repository.find();
  }
}

import { injectable } from "inversify";
import { ReturnModelType } from "@typegoose/typegoose";

import { DatabaseConnection } from "../../../database/database-connection";
import { User, DocumentUser } from "../models/user.model";
import { RepositoryBase } from "../../base/repository.base";
import { DocumentTodoList } from "../../todoList/models/todo-list.model";
import { DocumentTask } from "../../tasks/models/tasks.model";

@injectable()
export class UsersRepository extends RepositoryBase<User> {
    protected _repository: ReturnModelType<typeof User>;

    constructor(private _databaseConnection: DatabaseConnection) {
        super();
        this.initRepository(this._databaseConnection, User);
    }

    public async createUser(user: User): Promise<DocumentUser> {
        return this._repository.create(user);
    }

    public async findUserById(userId: string): Promise<DocumentUser> {
        return this._repository.findById(userId);
    }

    public async findUserByEmail(email: string): Promise<DocumentUser> {
        return this._repository.findOne({ email: email });
    }

    public async findUserByUsername(username: string): Promise<DocumentUser> {
        return this._repository.findOne({ username: username });
    }

    public async findByName(searchValue: string): Promise<DocumentUser[]> {
        return searchValue
            ? this._repository.find({
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
            : this._repository.find();
    }
}

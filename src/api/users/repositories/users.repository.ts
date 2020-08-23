import { injectable } from "inversify";
import { ReturnModelType } from "@typegoose/typegoose";

import { DatabaseConnection } from "../../../database/database-connection";
import { DocumentUser, User } from "../models/user.model";
import { RepositoryBase } from "../../base/repository.base";

@injectable()
export class UsersRepository extends RepositoryBase<User> {
  public repository: ReturnModelType<typeof User>;

  constructor(private _databaseConnection: DatabaseConnection) {
    super();
    this.initRepository(this._databaseConnection, User);
  }
}

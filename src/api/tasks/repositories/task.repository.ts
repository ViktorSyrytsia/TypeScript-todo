import { injectable } from "inversify";
import { ReturnModelType } from "@typegoose/typegoose";

import { DatabaseConnection } from "../../../database/database-connection";
import { Task } from "../models/tasks.model";
import { RepositoryBase } from "../../base/repository.base";

@injectable()
export class TasksRepository extends RepositoryBase<Task> {
  public repository: ReturnModelType<typeof Task>;

  constructor(private _databaseConnection: DatabaseConnection) {
    super();
    this.initRepository(this._databaseConnection, Task);
  }
}

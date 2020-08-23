import { injectable } from "inversify";
import { ReturnModelType } from "@typegoose/typegoose";

import { DatabaseConnection } from "../../../database/database-connection";
import { TodoList } from "../models/todo-list.model";
import { RepositoryBase } from "../../base/repository.base";

@injectable()
export class TodoListRepository extends RepositoryBase<TodoList> {
  public repository: ReturnModelType<typeof TodoList>;

  constructor(private _databaseConnection: DatabaseConnection) {
    super();
    this.initRepository(this._databaseConnection, TodoList);
  }
}

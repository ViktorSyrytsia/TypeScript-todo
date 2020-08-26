import { injectable } from "inversify";
import { ReturnModelType } from "@typegoose/typegoose";

import { DatabaseConnection } from "../../../database/database-connection";
import { TodoList, DocumentTodoList } from "../models/todo-list.model";
import { RepositoryBase } from "../../base/repository.base";

@injectable()
export class TodoListRepository extends RepositoryBase<TodoList> {
    protected _repository: ReturnModelType<typeof TodoList>;

    constructor(private _databaseConnection: DatabaseConnection) {
        super();
        this.initRepository(this._databaseConnection, TodoList);
    }

    public async createList(list: TodoList): Promise<DocumentTodoList> {
        return this._repository.create(list);
    }
    public async findListByID(id: string): Promise<DocumentTodoList> {
        return this._repository.findById(id);
    }
    public async deleteList(id: string): Promise<DocumentTodoList> {
        return this._repository.findByIdAndDelete(id);
    }

    public async findListByNameOrAll(
        searchValue: string
    ): Promise<DocumentTodoList[]> {
        return searchValue
            ? this._repository.find({
                  name: searchValue,
              })
            : this._repository.find();
    }

    public async saveList(list: DocumentTodoList): Promise<void> {
        list.save();
    }
}

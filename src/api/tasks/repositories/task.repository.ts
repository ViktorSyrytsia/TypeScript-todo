import { injectable } from "inversify";
import { ReturnModelType } from "@typegoose/typegoose";

import { DatabaseConnection } from "../../../database/database-connection";
import { Task, DocumentTask } from "../models/tasks.model";
import { RepositoryBase } from "../../base/repository.base";
import { CreateQuery } from "mongoose";
import { DocumentTodoList } from "../../todoList/models/todo-list.model";

@injectable()
export class TasksRepository extends RepositoryBase<Task> {
    protected _repository: ReturnModelType<typeof Task>;

    constructor(private _databaseConnection: DatabaseConnection) {
        super();
        this.initRepository(this._databaseConnection, Task);
    }

    public async createTask(task: CreateQuery<Task>): Promise<DocumentTask> {
        return this._repository.create(task);
    }

    public async findById(taskId: string): Promise<DocumentTask> {
        return this._repository.findById(taskId);
    }

    public async findByName(searchValue: string): Promise<DocumentTask[]> {
        return this._repository.find({ name: searchValue });
    }

    public async findTaskByList(
        list: DocumentTodoList
    ): Promise<DocumentTask[]> {
        return this._repository.find({ todoList: list._id });
    }

    public async deleteTask(id: string): Promise<DocumentTask> {
        return this._repository.findByIdAndDelete(id);
    }
}

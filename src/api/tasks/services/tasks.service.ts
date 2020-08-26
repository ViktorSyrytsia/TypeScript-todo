import { injectable } from "inversify";

import { TasksRepository } from "../repositories/task.repository";
import { DocumentTask, Task } from "../models/tasks.model";
import { DocumentTodoList } from "../../todoList/models/todo-list.model";

@injectable()
export class TasksService {
    constructor(private _tasksRepository: TasksRepository) {}

    public async createTask(task: Task): Promise<DocumentTask> {
        return this._tasksRepository.createTask(task);
    }
    public async findByID(id: string): Promise<DocumentTask> {
        return this._tasksRepository.findById(id);
    }

    public async findTaskByName(searchValue: string): Promise<DocumentTask[]> {
        return this._tasksRepository.findByName(searchValue);
    }

    public async findTaskByList(
        list: DocumentTodoList
    ): Promise<DocumentTask[]> {
        return this._tasksRepository.findTaskByList(list);
    }

    public async deleteTask(id: string): Promise<DocumentTask> {
        return this._tasksRepository.deleteTask(id);
    }
}

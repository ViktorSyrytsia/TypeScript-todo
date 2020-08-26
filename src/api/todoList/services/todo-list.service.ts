import { injectable } from "inversify";

import { TodoListRepository } from "../repositories/todo-list.repository";
import { DocumentTodoList, TodoList } from "../models/todo-list.model";

@injectable()
export class TodoListService {
    constructor(private _todoListRepository: TodoListRepository) {}

    public async createList(list: TodoList): Promise<DocumentTodoList> {
        return this._todoListRepository.createList(list);
    }
    public async findByID(id: string): Promise<DocumentTodoList> {
        return this._todoListRepository.findListByID(id);
    }
    public async deleteList(id: string): Promise<DocumentTodoList> {
        return this._todoListRepository.deleteList(id);
    }

    public async findListByName(
        searchValue: string
    ): Promise<DocumentTodoList[]> {
        return this._todoListRepository.findListByNameOrAll(searchValue);
    }

    public async saveList(list: DocumentTodoList): Promise<void> {
        return this._todoListRepository.saveList(list);
    }
}

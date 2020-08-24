import { injectable } from "inversify";

import { TodoListRepository } from "../repositories/todo-list.repository";
import { DocumentTodoList, TodoList } from "../models/todo-list.model";

@injectable()
export class TodoListService {
  constructor(private _todoListRepository: TodoListRepository) {}

  public async createList(list: TodoList): Promise<DocumentTodoList> {
    return this._todoListRepository.repository.create(list);
  }
  public async findByID(id: string): Promise<DocumentTodoList> {
    return this._todoListRepository.repository.findById(id);
  }
  public async deleteList(id: string): Promise<DocumentTodoList> {
    return this._todoListRepository.repository.findByIdAndDelete(id);
  }

  public async findListByName(
    searchValue: string
  ): Promise<DocumentTodoList[]> {
    return searchValue
      ? this._todoListRepository.repository.find({
          name: searchValue,
        })
      : this._todoListRepository.repository.find();
  }

  public async saveList(list: DocumentTodoList): Promise<void> {
    list.save();
  }
}

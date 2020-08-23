import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { DocumentType, prop, Ref } from "@typegoose/typegoose";
import { CreateQuery, DocumentToObjectOptions } from "mongoose";
import { User } from "../../users/models/user.model";
import { TodoList } from "../../todoList/models/todo-list.model";

export class Task extends Base {
  @prop({ required: true })
  public name: string;

  @prop({ ref: User })
  public author: Ref<User>;

  @prop({ ref: () => TodoList })
  public todoList: Ref<TodoList>[];

  constructor(task: CreateQuery<Task>) {
    super();
    Object.assign(this, task);
  }
}

export type DocumentTask = DocumentType<Task>;

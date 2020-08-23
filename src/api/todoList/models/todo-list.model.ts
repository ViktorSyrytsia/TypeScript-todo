import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { DocumentType, prop, Ref } from "@typegoose/typegoose";
import { CreateQuery, DocumentToObjectOptions } from "mongoose";
import { User } from "../../users/models/user.model";

export class TodoList extends Base {
  @prop({ required: true })
  public name: string;

  @prop({ ref: User })
  public author: Ref<User>;

  constructor(todoList: CreateQuery<TodoList>) {
    super();
    Object.assign(this, todoList);
  }
}

export type DocumentTodoList = DocumentType<TodoList>;

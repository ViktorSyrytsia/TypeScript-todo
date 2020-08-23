import { Request, Response } from "express";
import {
  controller,
  httpGet,
  principal,
  queryParam,
  request,
  response,
  httpPost,
} from "inversify-express-utils";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";

import { ControllerBase } from "../../base/controller.base";
import { Principal } from "../../auth/models/principal.model";
import { TodoListService } from "../services/todo-list.service";
import { DocumentTodoList, TodoList } from "../models/todo-list.model";
import { HttpError } from "../../../shared/models/http.error";

@controller("/lists")
export class TodoListController extends ControllerBase {
  constructor(private _todoListService: TodoListService) {
    super();
  }

  @httpGet("/")
  public async findLists(
    @principal() user: Principal,
    @queryParam("search") search: string,
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    try {
      const lists: DocumentTodoList[] = await this._todoListService.findListByName(
        search
      );
      let listsArray: DocumentTodoList[] = lists.filter(
        (list) => list.author.toString() === user.details._id.toHexString()
      );
      return this._success<{ lists: DocumentTodoList[] }>(res, 200, {
        lists: listsArray,
      });
    } catch (error) {
      return this._fail(
        res,
        new HttpError(INTERNAL_SERVER_ERROR, error.message)
      );
    }
  }

  @httpPost("/")
  public async createList(
    @principal() user: Principal,
    @queryParam("search") search: string,
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    const listName: string = req.body.name;
    try {
      const list: DocumentTodoList = await this._todoListService.createList(
        new TodoList({
          name: listName,
          author: user.details,
        })
      );
      return this._success<{ list: DocumentTodoList }>(res, 200, { list });
    } catch (error) {
      return this._fail(
        res,
        new HttpError(INTERNAL_SERVER_ERROR, error.message)
      );
    }
  }
}

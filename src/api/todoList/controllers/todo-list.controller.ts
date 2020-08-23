import { Request, Response } from "express";
import {
  controller,
  httpGet,
  principal,
  queryParam,
  request,
  response,
  httpPost,
  requestParam,
} from "inversify-express-utils";
import {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  NOT_FOUND,
} from "http-status-codes";

import { ControllerBase } from "../../base/controller.base";
import { Principal } from "../../auth/models/principal.model";
import { TodoListService } from "../services/todo-list.service";
import { DocumentTodoList, TodoList } from "../models/todo-list.model";
import { HttpError } from "../../../shared/models/http.error";
import { TasksService } from "../../tasks/services/tasks.service";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";
import { params } from "inversify-express-utils/dts/decorators";

@controller("/lists")
export class TodoListController extends ControllerBase {
  constructor(
    private _todoListService: TodoListService,
    private _taskService: TasksService
  ) {
    super();
  }

  @httpGet("/", AuthMiddleware)
  public async findLists(
    @principal() user: Principal,
    @queryParam("search") search: string,
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    try {
      if (user.details) {
        const lists: DocumentTodoList[] = await this._todoListService.findListByName(
          search
        );
        let listsArray: DocumentTodoList[] = lists.filter(
          (list) => list.author.toString() === user.details._id.toHexString()
        );
        return this._success<{ lists: DocumentTodoList[] }>(res, 200, {
          lists: listsArray,
        });
      } else {
        res.status(UNAUTHORIZED).json({
          status: "fail",
          message: "You need to authorize first",
        });
      }
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
          tasks: [],
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

  @httpGet("/:id", AuthMiddleware)
  public async findListById(
    @principal() user: Principal,
    @queryParam("search") search: string,
    @requestParam() params: any,
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    try {
      const id = params.id;
      if (user.details) {
        let list: DocumentTodoList = await this._todoListService.findByID(id);
        if (!list) {
          return this._fail(
            res,
            new HttpError(NOT_FOUND, "There no list with this ID")
          );
        }
        if (list.author.toString() === user.details._id.toHexString()) {
          return this._success<{ list: DocumentTodoList }>(res, 200, {
            list: list,
          });
        } else {
          return this._success<{ message: string }>(res, 200, {
            message: "You dont have rights for this list",
          });
        }
      } else {
        res.status(UNAUTHORIZED).json({
          status: "fail",
          message: "You need to authorize first",
        });
      }
    } catch (error) {
      return this._fail(
        res,
        new HttpError(INTERNAL_SERVER_ERROR, error.message)
      );
    }
  }
}

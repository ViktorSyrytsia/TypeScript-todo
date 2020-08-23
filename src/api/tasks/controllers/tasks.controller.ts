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
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";

import { ControllerBase } from "../../base/controller.base";
import { Principal } from "../../auth/models/principal.model";
import { TasksService } from "../services/tasks.service";
import { DocumentTask, Task } from "../models/tasks.model";
import { HttpError } from "../../../shared/models/http.error";

@controller("/tasks")
export class TasksController extends ControllerBase {
  constructor(private _taskService: TasksService) {
    super();
  }

  @httpGet("/")
  public async findTasks(
    @principal() user: Principal,
    @queryParam("search") search: string,
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    try {
      if (user.details) {
        const tasks: DocumentTask[] = await this._taskService.findTaskByName(
          search
        );
        let tasksArray: DocumentTask[] = tasks.filter(
          (task) => task.author.toString() === user.details._id.toString()
        );
        return this._success<{ tasks: DocumentTask[] }>(res, 200, {
          tasks: tasksArray,
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
  public async createTask(
    @principal() user: Principal,
    @queryParam("search") search: string,
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    const taskName: string = req.body.name;
    try {
      const task: DocumentTask = await this._taskService.createTask(
        new Task({
          name: taskName,
          author: user.details,
        })
      );
      return this._success<{ task: DocumentTask }>(res, 200, { task });
    } catch (error) {
      return this._fail(
        res,
        new HttpError(INTERNAL_SERVER_ERROR, error.message)
      );
    }
  }
}

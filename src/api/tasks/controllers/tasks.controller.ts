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
    httpDelete,
    httpPatch,
} from "inversify-express-utils";
import {
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
    NOT_FOUND,
} from "http-status-codes";

import { ControllerBase } from "../../base/controller.base";
import { Principal } from "../../auth/models/principal.model";
import { TasksService } from "../services/tasks.service";
import { DocumentTask, Task } from "../models/tasks.model";
import {
    DocumentTodoList,
    TodoList,
} from "../../todoList/models/todo-list.model";
import { HttpError } from "../../../shared/models/http.error";
import { TodoListService } from "../../todoList/services/todo-list.service";
import { params } from "inversify-express-utils/dts/decorators";
import { id } from "inversify";

@controller("/tasks")
export class TasksController extends ControllerBase {
    constructor(
        private _taskService: TasksService,
        private _todoListService: TodoListService
    ) {
        super();
    }

    @httpGet("/")
    public async getAllTasks(
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
                    (task) =>
                        task.author.toString() === user.details._id.toString()
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
        @request() req: Request,
        @response() res: Response
    ): Promise<Response> {
        const taskName: string = req.body.name;
        const listId: string = req.body.listId;
        try {
            const list: DocumentTodoList = await this._todoListService.findByID(
                listId
            );

            const task: DocumentTask = await this._taskService.createTask(
                new Task({
                    name: taskName,
                    author: user.details,
                    todoList: list,
                    isFinished: false,
                })
            );

            list.tasks.push(task);
            await this._todoListService.saveList(list);

            return this._success<{ task: DocumentTask }>(res, 200, { task });
        } catch (error) {
            return this._fail(
                res,
                new HttpError(INTERNAL_SERVER_ERROR, error.message)
            );
        }
    }

    @httpGet("/:id")
    public async getOneTaskById(
        @principal() user: Principal,
        @requestParam() params: any,
        @request() req: Request,
        @response() res: Response
    ): Promise<Response> {
        try {
            const id: string = params.id;
            if (user.details) {
                const task: DocumentTask = await this._taskService.findByID(id);
                if (!task) {
                    return this._fail(
                        res,
                        new HttpError(NOT_FOUND, "There no list with this ID")
                    );
                }
                if (task.author.toString() === user.details._id.toHexString()) {
                    return this._success<{ task: DocumentTask }>(res, 200, {
                        task: task,
                    });
                } else {
                    return this._success<{ message: string }>(res, 200, {
                        message: "You dont have rights for this task",
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

    @httpGet("/list?")
    public async getAllTasksByList(
        @principal() user: Principal,
        @queryParam("list") listId: string,
        @request() req: Request,
        @response() res: Response
    ): Promise<Response> {
        try {
            if (user.details) {
                let list: DocumentTodoList = await this._todoListService.findByID(
                    listId
                );
                if (!list) {
                    return this._fail(
                        res,
                        new HttpError(NOT_FOUND, "There no list with this ID")
                    );
                }
                if (list.author.toString() === user.details._id.toHexString()) {
                    const tasks: DocumentTask[] = await this._taskService.findTaskByList(
                        list
                    );
                    return this._success<{ tasks: DocumentTask[] }>(res, 200, {
                        tasks: tasks,
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

    @httpPatch("/:id")
    public async toggleIsFinished(
        @principal() user: Principal,
        @requestParam() params: any,
        @request() req: Request,
        @response() res: Response
    ): Promise<Response> {
        try {
            const id: string = params.id;
            if (user.details) {
                const task: DocumentTask = await this._taskService.findByID(id);
                if (!task) {
                    return this._fail(
                        res,
                        new HttpError(NOT_FOUND, "There no list with this ID")
                    );
                }
                if (task.author.toString() === user.details._id.toHexString()) {
                    task.isFinished = !task.isFinished;

                    await task.save();
                    return this._success<{ task: DocumentTask }>(res, 200, {
                        task: task,
                    });
                } else {
                    return this._success<{ message: string }>(res, 200, {
                        message: "You dont have rights for this task",
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

    @httpDelete("/:id")
    public async deleteTask(
        @principal() user: Principal,
        @requestParam() params: any,
        @request() req: Request,
        @response() res: Response
    ): Promise<Response> {
        try {
            const id: string = params.id;
            const task: DocumentTask = await this._taskService.findByID(id);
            console.log(task);

            const list: DocumentTodoList = await this._todoListService.findByID(
                task.todoList.toString()
            );
            console.log(list);

            list.tasks = list.tasks.filter(
                (taskId) => taskId.toString() !== task._id.toHexString()
            );
            await this._taskService.deleteTask(id);
            await this._todoListService.saveList(list);
            return this._success<{ list: DocumentTodoList }>(res, 200, {
                list: null,
            });
        } catch (error) {
            return this._fail(
                res,
                new HttpError(INTERNAL_SERVER_ERROR, error.message)
            );
        }
    }
}

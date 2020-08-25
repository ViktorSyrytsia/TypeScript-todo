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
import {
  ApiPath,
  ApiOperationGet,
  SwaggerDefinitionConstant,
  ApiOperationPost,
} from "swagger-express-typescript";

import { ControllerBase } from "../../base/controller.base";
import { Principal } from "../../auth/models/principal.model";
import { UsersService } from "../services/users.service";
import { DocumentUser } from "../models/user.model";
import { HttpError } from "../../../shared/models/http.error";
import { AuthMiddleware } from "../../auth/middleware/auth.middleware";

@ApiPath({
  path: "/api/v1/users",
  name: "User",
  security: { apiKeyHeader: [] },
})
@controller("/users")
export class UsersController extends ControllerBase {
  constructor(private _userService: UsersService) {
    super();
  }

  @ApiOperationGet({
    description: "Get users objects list",
    summary: "Get users list",
    responses: {
      200: {
        description: "Success",
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: "User",
      },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  @httpGet("/", AuthMiddleware)
  public async findUsers(
    @principal() user: Principal,
    @queryParam("search") search: string,
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    try {
      const users: DocumentUser[] = await this._userService.findByName(search);
      return this._success<{ users: DocumentUser[] }>(res, 200, { users });
    } catch (error) {
      return this._fail(
        res,
        new HttpError(INTERNAL_SERVER_ERROR, error.message)
      );
    }
  }

  @ApiOperationPost({
    description: "Post user object",
    summary: "Post new user",
    parameters: {
      body: { description: "New User", required: true, model: "User" },
    },
    responses: {
      200: { description: "Success" },
      400: { description: "Parameters fail" },
    },
    security: {
      apiKeyHeader: [],
    },
  })
  @httpPost("/")
  public async createUser(
    @principal() user: Principal,
    @queryParam("search") search: string,
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    try {
      const user: DocumentUser = await this._userService.createUser(req.body);
      return this._success<{ user: DocumentUser }>(res, 200, { user });
    } catch (error) {
      return this._fail(
        res,
        new HttpError(INTERNAL_SERVER_ERROR, error.message)
      );
    }
  }
}

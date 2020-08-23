import { injectable } from "inversify";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import {
  CONFLICT,
  NOT_ACCEPTABLE,
  NOT_FOUND,
  UNAUTHORIZED,
} from "http-status-codes";
import { DocumentUser, User } from "../../users/models/user.model";
import { Credentials } from "../interfaces/credentials.interface";
import { UsersService } from "../../users/services/users.service";
import { UserWithTokenResponse } from "../interfaces/user-with-token-response.interface";
import { HttpError } from "../../../shared/models/http.error";

@injectable()
export class AuthService {
  constructor(private _usersService: UsersService) {}

  public async getUserFromToken(token: string): Promise<User> {
    console.log("token:", token);
    if (!token) {
      throw new HttpError(
        UNAUTHORIZED,
        "You are not logged in! Please log in to get access"
      );
    }
    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_KEY);
      console.log("decodedToken:", decodedToken);
      const user: DocumentUser = await this._usersService.findByID(
        decodedToken.id
      );
      return user;
    } catch (error) {
      throw new HttpError(UNAUTHORIZED, "UNAUTHORIZED");
    }
  }

  public async signUp(
    credentials: Credentials
  ): Promise<UserWithTokenResponse> {
    let existingUser: DocumentUser = await this._usersService.findUserByEmail(
      credentials.email
    );
    if (!!existingUser) {
      throw new HttpError(CONFLICT, "This email already exists");
    }
    existingUser = await this._usersService.findUserByUsername(
      credentials.username
    );
    if (!!existingUser) {
      throw new HttpError(NOT_ACCEPTABLE, "This username already exists");
    }
    try {
      const hash: string = await bcrypt.hash(credentials.password, 10);
      const user: DocumentUser = await this._usersService.createUser(
        new User({
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          username: credentials.username,
          password: hash,
          email: credentials.email,
          role: credentials.role,
        })
      );
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return { user, token };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async signIn(
    credentials: Credentials
  ): Promise<UserWithTokenResponse> {
    const user: DocumentUser = await this._usersService.findUserByUsername(
      credentials.username
    );
    if (!user) {
      throw new HttpError(NOT_FOUND, "There are no users with this username");
    }
    try {
      if (await bcrypt.compare(credentials.password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return { user, token };
      } else {
        throw new HttpError(NOT_ACCEPTABLE, "Wrong password");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

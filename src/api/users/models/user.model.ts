import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { DocumentType, prop } from "@typegoose/typegoose";
import { CreateQuery } from "mongoose";
import { ApiModel, ApiModelProperty } from "swagger-express-typescript";

@ApiModel({
  description: "User description",
  name: "User",
})
export class User extends Base {
  @ApiModelProperty({
    description: "User firstname",
    required: true,
    example: ["Vasya"],
  })
  @prop({ required: true })
  public firstName: string;

  @ApiModelProperty({
    description: "User lastname",
    required: true,
    example: ["Ivanov"],
  })
  @prop({ required: true })
  public lastName: string;

  @ApiModelProperty({
    description: "User password",
    required: true,
    example: ["qwerty"],
  })
  @prop({ required: true })
  public password: string;

  @ApiModelProperty({
    description: "User nickname",
    required: true,
    example: ["vasa666"],
  })
  @prop({ required: true })
  public username: string;

  @ApiModelProperty({
    description: "User email",
    required: true,
    example: ["vasya666@gmail.com"],
  })
  @prop({ required: true })
  public email: string;

  @ApiModelProperty({
    description: "User role",
    required: true,
    example: ["Admin"],
  })
  @prop({ required: true, default: "user" })
  public role: string;

  constructor(user: CreateQuery<User>) {
    super();
    Object.assign(this, user);
  }
}

export type DocumentUser = DocumentType<User>;

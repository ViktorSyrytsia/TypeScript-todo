import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { DocumentType, prop, Ref } from "@typegoose/typegoose";
import { CreateQuery } from "mongoose";
import { User } from "../../users/models/user.model";

export class Token extends Base {
    @prop({ ref: () => User, required: true })
    public user: Ref<User>;

    @prop({ required: true })
    public body: String;

    @prop({ required: true })
    public tokenType: String;

    @prop({ required: true })
    public creeatedAt: Date;

    constructor(token: CreateQuery<Token>) {
        super();
        Object.assign(this, token);
    }
}

export type DocumentToken = DocumentType<Token>;

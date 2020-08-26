import { injectable } from "inversify";
import { ReturnModelType } from "@typegoose/typegoose";

import { DatabaseConnection } from "../../../database/database-connection";
import { RepositoryBase } from "../../base/repository.base";
import { Token } from "../../auth/models/token.model";

@injectable()
export class TokenRepository extends RepositoryBase<Token> {
    protected _repository: ReturnModelType<typeof Token>;

    constructor(private _databaseConnection: DatabaseConnection) {
        super();
        this.initRepository(this._databaseConnection, Token);
    }
}

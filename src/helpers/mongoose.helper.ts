import {ClientSession, Types} from "mongoose";
import {CommonQuery} from "../interface/populate-option.interface";
import {UtilHelper} from "./util.helper";
import {Logger} from "./logger.helper";
import {IMongooseOptions} from "../interface/mongoose-options.interface";
import mongoose from 'mongoose';
import { get } from "lodash";

type DatabaseOperationFunction = (mongooseOptions: IMongooseOptions) => Promise<any>;

export class MongooseHelper {

    public static getFindModelWithCommonQuery(documentQuery: any, {select, populate, limit, skip}: CommonQuery) {

        if (select) {
            documentQuery.select(select.split(',').join(' '))
        }

        if (populate) {
            documentQuery.populate(UtilHelper.getPopulateObjectFromString(populate));
        }

        if (limit) {
            documentQuery.limit(limit);
        }

        if (skip) {
            documentQuery.skip(skip);
        }

        return documentQuery;
    }

    static async createNewTransactionIfNotExist(mongooseOptions: IMongooseOptions = {}): Promise<boolean> {

        let isNew = false;

        const transactionOptions = {
            writeConcern: {
                w: 3,
                j: true
            }
        };

        if (!mongooseOptions.saveOptions || !mongooseOptions.saveOptions.session) {
            const newSession = await mongoose.startSession();
            mongooseOptions.saveOptions = { session: newSession};
            newSession.startTransaction(transactionOptions);
            Logger.debug(`[MongooseHelper]: Creating new session and starting transaction.`);
            isNew = true;
        } else if (!mongooseOptions.saveOptions.session.inTransaction()) {
            mongooseOptions.saveOptions.session.startTransaction(transactionOptions);
            Logger.debug(`[MongooseHelper]: Starting transaction for existing session.`);
        }
        return isNew;
    }

    static async executeOperationInsideTransaction<T extends DatabaseOperationFunction>(operationFn: T, mongooseOptions: IMongooseOptions): Promise<ReturnType<T>> {
        const isTransactionLocal: boolean = await MongooseHelper.createNewTransactionIfNotExist(mongooseOptions);
        const session = mongooseOptions.saveOptions!.session!;
        let result;

        try {
            result = await operationFn(mongooseOptions);

            if (isTransactionLocal) {
                await session.commitTransaction();
                session.endSession();
            }

            return result;
        } catch (error) {
            // session.id is available only before aborting and closing the session
            const sessionId = session ? get((session as ClientSession), 'id.id.buffer').toString('hex') : 'no-session-id';

            if (isTransactionLocal) {
                await session.abortTransaction();
                session.endSession();
            }

            Logger.error(`[MongooseHelper]: Transaction with session id: ${sessionId} failed.`, { cause: error });

            throw error;
        }
    }

    static toObjectId(id: string | Types.ObjectId): Types.ObjectId {
        return Types.ObjectId(String(id));
    }

    static getObjectId(): Types.ObjectId {
        return Types.ObjectId();
    }

    static toObjectIds(ids: string[]): Types.ObjectId[] {
        return ids.map(MongooseHelper.toObjectId);
    }
}

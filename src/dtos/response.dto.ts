import {ResponseStatusEnum} from "../enums/response-status.enum";
import {GeneralMessageCodeEnum} from "../enums/general-message-code.enum";

export type ResponseMessageCode = GeneralMessageCodeEnum;

export type HttpStatusCode = number;

export class Message extends Error {
    constructor(
        public code: ResponseMessageCode,
        public msg?: any,
        public statusCode?: HttpStatusCode
    ) {
        super(msg || '');

        // Inherited from Error
        this.name = `Error:${code}`;
    }

    toString() {
        let str = `[${this.code}]:`;

        if (this.statusCode) {
            str += ` status_code=${this.statusCode}:`;
        }

        return this.msg ? `${str} ${this.msg}` : str;
    }

    toJSON() {
        return {
            code: this.code,
            msg: this.msg,
            statusCode: this.statusCode,
        };
    }
}

export class ResponseDto<T> {
    constructor(
        public data?: T,
        public status: ResponseStatusEnum = ResponseStatusEnum.Ok,
        public message?: Message
    ) {
    }
}

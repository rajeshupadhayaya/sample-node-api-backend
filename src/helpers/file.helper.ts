import fs from "promise-fs";
import {UtilHelper} from "./util.helper";

export interface IFormFileDataPayload {
    _data: string;
    hapi: {
        filename: string
    };
}

export interface ITempFile {
    filePath: string;
    fileName: string;
    remove: () => void;
}

export class FileHelper {

    static async createTempFileFromFileData(fileData: Buffer | string, fileName: string): Promise<ITempFile> {
        const filePath = `/var/tmp/${UtilHelper.generateUniqueId()}_${fileName}`;
        const fileWriteError = await fs.writeFile(filePath, fileData);

        if (fileWriteError) {
            throw new Error(`Failed to create temp file for from file data, cause: ${fileWriteError}`);
        }

        return {
            filePath,
            fileName,
            remove: () => UtilHelper.deleteFile(filePath)
        };
    }
}

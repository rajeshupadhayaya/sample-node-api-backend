export interface ITemplateHelpers {
    getEduCrackWebAppUrl(makerId?: string): string;
}

export class TemplatesHelper {
    public static getTemplateHelperFunctions(): ITemplateHelpers {
        return {
            getEduCrackWebAppUrl: (): string => {
                const url = process.env.EDUCRACK_WEB_BASE_URL!;

                return url;
            }
        };
    }
}

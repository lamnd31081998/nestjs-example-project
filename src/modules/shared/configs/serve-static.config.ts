import { Injectable } from "@nestjs/common";
import { ServeStaticModuleOptions, ServeStaticModuleOptionsFactory } from "@nestjs/serve-static";

@Injectable()
export class ServeStaticConfig implements ServeStaticModuleOptionsFactory {
    createLoggerOptions(): ServeStaticModuleOptions[] {
        return [
            {
                rootPath: 'public'
            }
        ];
    }
}
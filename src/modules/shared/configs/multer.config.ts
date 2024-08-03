import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import * as multer from "multer";
import * as fs from "fs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    if (!fs.existsSync('upload')) fs.mkdirSync('upload');
                    cb(null, './upload');
                },
                filename: function (req, file, cb) {
                    cb(null, `${Date.now()}_${file.originalname}`);
                }
            })
        }
    }
}
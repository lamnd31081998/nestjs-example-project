import { Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Put, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiForbiddenResponse, ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { Response } from "express";
import { UserUpdateByTokenDto } from "./user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Put('')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'token', description: 'Bearer Token', required: true })
    @ApiUnauthorizedResponse()
    @ApiForbiddenResponse()
    @ApiInternalServerErrorResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse()
    async updateByToken(
        @Req() request: any,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: /image/g }),
                    new MaxFileSizeValidator({ maxSize: 2 * 1000 * 1000 })
                ],
                fileIsRequired: false
            })
        ) file: Express.Multer.File,
        @Body() payload: UserUpdateByTokenDto,
        @Res() response: Response
    ) {
        const result = await this.userService.updateByToken(request.tokenInfo, payload, file);
        return response.status(result.status).json(result);
    }
}
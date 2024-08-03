import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { UserRepo } from "src/modules/user/user.repository";
import { UserStatus } from "src/modules/user/user.interface";

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
    constructor(
        private readonly userRepo: UserRepo
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        return next.handle().pipe(
            tap(() => {
                let request = context.switchToHttp().getRequest();
                
                if (request.path == '/login') {
                    let response = context.switchToHttp().getResponse();
                    if (response.statusCode == HttpStatus.OK) {
                        this.userRepo.save({ username: request.body.username, status: UserStatus.ONLINE, last_active: new Date() });
                    }
                }
                else if (request.path == '/logout') {
                    let response = context.switchToHttp().getResponse();
                    if (response.statusCode == HttpStatus.OK) {
                        this.userRepo.save({ id: request.tokenInfo.user.id, status: UserStatus.OFFLINE });
                    }
                }
                else {
                    let response = context.switchToHttp().getResponse();
                    if (response.statusCode == HttpStatus.OK || response.statusCode == HttpStatus.CREATED) {
                        this.userRepo.save({ id: request.tokenInfo.user.id, status: UserStatus.ONLINE, last_active: new Date() });
                    }
                }
            })
        );
    }
}
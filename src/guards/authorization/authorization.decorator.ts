import { SetMetadata } from "@nestjs/common";

export const Authorization = (secured: boolean) =>
    SetMetadata('Authorization', secured);
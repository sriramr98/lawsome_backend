import { IsNotEmpty } from 'class-validator';

export class CreateConvoDto {
    @IsNotEmpty()
    readonly title: string;
}

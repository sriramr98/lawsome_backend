import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
    @IsOptional()
    readonly feedback?: string;

    @IsNotEmpty()
    readonly chat_id: number;

    @IsNotEmpty()
    readonly is_liked: boolean;
}

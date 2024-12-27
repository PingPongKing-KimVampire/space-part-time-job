import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ApplyToJobPostRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  jobPostId: string;

  @MaxLength(200, { message: '자기소개는 200자 이하이어야 합니다.' })
  @MinLength(15, { message: '자기소개는 15자 이상이어야 합니다.' })
  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}

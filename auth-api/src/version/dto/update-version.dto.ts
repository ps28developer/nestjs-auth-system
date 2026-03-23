import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * Semantic version pattern (e.g. 1.1.76, 2.0.0)
 */
const SEMVER_PATTERN = /^\d+(\.\d+){0,2}(-[a-zA-Z0-9.-]+)?$/;

export class UpdateVersionDto {
  @IsNotEmpty()
  @IsString()
  @Matches(SEMVER_PATTERN, {
    message: 'latestVersion must be a valid version (e.g. 1.1.76)',
  })
  latestVersion: string;
}

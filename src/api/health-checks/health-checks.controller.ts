import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator
} from '@nestjs/terminus';
import Bugsnag from '@bugsnag/js';
import { promises as fsPromises, existsSync as fsExistsSync } from 'fs';
import { join } from 'path';

@Controller('health-check')
/**
 * Controller for handling health check related requests.
 */
export class HealthChecksController {
  /**
   * HealthChecksController constructor.
   * @param {HealthCheckService} health
   * - The injected HealthCheckService instance.
   * @param {TypeOrmHealthIndicator} db
   * - The injected TypeOrmHealthIndicator instance.
   */
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  /**
   * Health check endpoint.
   * @return {Promise<HealthCheckResult>} - The health check result.
   * @throws {Error} - If the database is not connected.
   */
  @Get('/')
  @HealthCheck()
  async check() {
    const errors = [];

    // Database Check
    const dbCheck = await this.health.check([
      () => this.db.pingCheck('database')
    ]);
    const dbCheckResult = dbCheck.status === 'ok';
    if (!dbCheckResult) {
      errors['db'] = dbCheck.error;
    }

    // Git Branch
    const gitBranchFileName = 'git_branch.txt';
    const gitBranchFilePath = join(process.cwd(), 'dist/', gitBranchFileName);
    const gitBranch = fsExistsSync(gitBranchFilePath)
      ? await fsPromises.readFile(gitBranchFilePath, 'utf-8')
      : '';

    // Git Commit ID
    const gitCommitIDFileName = 'git_last_commit_hash.txt';
    const gitCommitIDFilePath = join(
      process.cwd(),
      'dist/',
      gitCommitIDFileName
    );
    const gitCommitID = fsExistsSync(gitCommitIDFilePath)
      ? await fsPromises.readFile(gitCommitIDFilePath, 'utf-8')
      : '';

    // Build Time
    const buildTimeFileName = 'build_time.txt';
    const buildTimeFilePath = join(process.cwd(), 'dist/', buildTimeFileName);
    const buildTime = fsExistsSync(buildTimeFilePath)
      ? await fsPromises.readFile(buildTimeFilePath, 'utf-8')
      : '';

    return {
      success: errors.length === 0,
      db: dbCheckResult,

      bugsnag: Bugsnag.isStarted(),
      gitBranch: gitBranch.trim(),
      gitCommitID: gitCommitID.trim(),
      buildTime: buildTime.trim(),
      errors
    };
  }
}

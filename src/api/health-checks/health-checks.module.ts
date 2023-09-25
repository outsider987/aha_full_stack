import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthChecksController } from "./health-checks.controller";

@Module({
  controllers: [HealthChecksController],
  imports: [TerminusModule],
})
/**
 * HealthChecksModule class.
 */
export class HealthChecksModule {}

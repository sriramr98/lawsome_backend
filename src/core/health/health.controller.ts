import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    SequelizeHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private healthCheck: HealthCheckService,
        private db: SequelizeHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.healthCheck.check([() => this.db.pingCheck('database')]);
    }
}

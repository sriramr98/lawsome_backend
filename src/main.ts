import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import * as Sentry from '@sentry/node';
import { GlobalExceptionFilter } from './utils/GlobalExceptionFilter';
import { ConfigService } from '@nestjs/config';
import {
    SentrySpanProcessor,
    SentryPropagator,
} from '@sentry/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import otelApi from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { ProfilingIntegration } from '@sentry/profiling-node';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const config = app.get(ConfigService);

    Sentry.init({
        dsn: config.get<string>('sentry.dsn'),
        environment: config.get<string>('env'),
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.Mysql(),
            // new ProfilingIntegration(),
        ],
        tracesSampleRate: 1.0,
        // profilesSampleRate: 1.0,
        instrumenter: 'otel',
    });

    const sdk = new NodeSDK({
        // Existing config
        traceExporter: new OTLPTraceExporter(),
        instrumentations: [getNodeAutoInstrumentations()],

        // Sentry config
        spanProcessor: new SentrySpanProcessor(),
        textMapPropagator: new SentryPropagator(),
    });

    app.useLogger(app.get(Logger));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    sdk.start();

    await app.listen(8000, '0.0.0.0');
}

bootstrap();

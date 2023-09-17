import {MiddlewareConsumer, Module,
  NestModule, RequestMethod} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './config/configuration';
import {JwtService} from '@nestjs/jwt';
import {AuthModule} from './api/auth/auth.module';
import {LoggerMiddleware} from './middleware/logger.middleware';
import {LocaleMiddleware} from './middleware/local.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('defaultConnection'),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [JwtService],
})

/**
 * The root module of the application.
 * @module AppModule
 * @implements {NestModule}
 */
export class AppModule implements NestModule {
  /**
     * Configures the middleware.
     * @param {MiddlewareConsumer} consumer - The middleware consumer.
     * @return {void}
     */
  configure(consumer: MiddlewareConsumer): any {
    consumer
        .apply(LoggerMiddleware, LocaleMiddleware)
        .exclude({path: '/health-check', method: RequestMethod.GET})
        .forRoutes('*');
  }
}

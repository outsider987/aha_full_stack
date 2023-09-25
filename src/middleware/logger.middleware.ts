import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as logger from "../utils/logger";
import { JwtService } from "@nestjs/jwt";

@Injectable()
/**
 * Middleware for logging requests and responses.
 */
export class LoggerMiddleware implements NestMiddleware {
  /**
   * Creates an instance of LoggerMiddleware.
   * @param {JwtService} jwt - The injected JWT service instance.
   */
  constructor(private jwt: JwtService) {}
  /**
   * Gets the user ID from the request.
   * @param {Request} request - The request object.
   * @return {string} - The user ID.
   */
  getUserId(request) {
    if (request.headers.authorization) {
      const token = request.headers.authorization.replace("Bearer", "").trim();
      try {
        const validated = this.jwt.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        return validated.sub ?? undefined;
      } catch (error) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  /**
   * Logs the request and response.
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @param {NextFunction} next - The next function.
   */
  use(request: Request, response: Response, next: NextFunction) {
    const startAt = process.hrtime();

    // Generate Random Reference ID
    global.requestId = logger.generateRequestId(request);

    // Log Request Details
    logger.event({
      method: request.method,
      url: request.originalUrl,
      query: Object.keys(request.query).length > 0 ? request.query : undefined,
      body: Object.keys(request.body).length > 0 ? request.body : undefined,
      ip: request.ip,
      userAgent: request.get("user-agent"),
      headers: request.headers,
      clinicId: this.getUserId(request),
    });

    next();

    // Log Response Details
    const send = response.send;
    response.send = (responseBody) => {
      const diff = process.hrtime(startAt);
      logger.event({
        response:
          typeof responseBody === "string"
            ? JSON.parse(responseBody)
            : typeof responseBody,
        statusCode: response.statusCode,
        responseTime: (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2) + "ms",
      });
      response.send = send;
      return response.send(responseBody);
    };
  }
}

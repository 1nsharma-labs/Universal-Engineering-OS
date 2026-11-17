import { Controller, Get } from '@nestjs/common';

@Controller('api/v1')
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'UP',
      architecture: 'NestJS Modular Architecture',
      diEnabled: true,
      timestamp: new Date().toISOString()
    };
  }
}

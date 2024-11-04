import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    MainPage() {
        return "hello world";
    }
}
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RequestService } from './request.service';
import { Request } from './request.entity';

@Controller('request')
export class RequestController {
    constructor(private readonly requestService: RequestService) { }

    @Get()
    findAll() {
        return this.requestService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('type') type: string) {
        return this.requestService.findOne(+id, type);
    }

    @Post()
    create(@Body() hospital: Partial<Request>) {
        return this.requestService.create(hospital);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() request: Partial<Request>) {
        return this.requestService.update(+id, request);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Query('type') type: string) {
        return this.requestService.remove(+id, type);
    }

    @Delete('all/:id')
    removeAll(@Param('id') id: string, @Query('type') type: string) {
        return this.requestService.removeAll(+id, type);
    }
}
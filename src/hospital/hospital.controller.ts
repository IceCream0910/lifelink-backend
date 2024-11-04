import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { Hospital } from './hospital.entity';

@Controller('hospital')
export class HospitalController {
    constructor(private readonly hospitalService: HospitalService) { }

    @Get()
    findAll() {
        return this.hospitalService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.hospitalService.findOne(+id);
    }

    @Post()
    create(@Body() hospital: Partial<Hospital>) {
        return this.hospitalService.create(hospital);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() hospital: Partial<Hospital>) {
        return this.hospitalService.update(+id, hospital);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hospitalService.remove(+id);
    }

    @Post('send-requests')
    sendRequests(
        @Query('patientId') patientId: string,
        @Query('location') location: string,
    ) {
        return this.hospitalService.sendRequests(+patientId, location);
    }
}
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Patient } from './patient.entity';

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    @Get()
    findAll() {
        return this.patientService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.patientService.findOne(+id);
    }

    @Post()
    create(@Body() patient: Partial<Patient>) {
        return this.patientService.create(patient);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() patient: Partial<Patient>) {
        return this.patientService.update(+id, patient);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.patientService.remove(+id);
    }
}
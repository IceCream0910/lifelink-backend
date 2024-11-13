import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HospitalService } from './hospital/hospital.service';
import { HospitalController } from './hospital/hospital.controller';
import { PatientService } from './patient/patient.service';
import { PatientController } from './patient/patient.controller';
import { RequestService } from './request/request.service';
import { RequestController } from './request/request.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HospitalController, PatientController, RequestController],
  providers: [HospitalService, PatientService, RequestService],
})
export class AppModule { }
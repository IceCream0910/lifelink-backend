import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HospitalService } from './hospital/hospital.service';
import { HospitalController } from './hospital/hospital.controller';
import { PatientService } from './patient/patient.service';
import { PatientController } from './patient/patient.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HospitalController, PatientController],
  providers: [HospitalService, PatientService],
})
export class AppModule { }
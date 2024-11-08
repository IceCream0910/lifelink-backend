import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Patient } from './patient.entity';
import { NearbyHospital } from './nearby-hospital.interface';

@Injectable()
export class PatientService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY);
    }

    async findAll(): Promise<Patient[]> {
        const { data, error } = await this.supabase.from('patients').select('*');
        if (error) throw error;
        return data;
    }

    async findOne(id: number): Promise<Patient> {
        const { data, error } = await this.supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    async create(patient: Partial<Patient>): Promise<Patient> {
        const { data, error } = await this.supabase
            .from('patients')
            .insert(patient)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async update(id: number, patient: Partial<Patient>): Promise<Patient> {
        const { data, error } = await this.supabase
            .from('patients')
            .update(patient)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async remove(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('patients')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }

    async sendRequests(patientId: string): Promise<NearbyHospital[]> {
        // 1. patientId를 가진 patient row의 location 가져오기
        const { data: patient, error: patientError } = await this.supabase
            .from('patients')
            .select('location')
            .eq('id', patientId)
            .single();
        if (patientError) throw patientError;

        const patientLocation = patient.location;

        // 2. 환자 위치 기준으로 가까운 병원 10개 검색
        const { data: nearbyHospitals, error } = await this.supabase
            .rpc('find_nearest_hospitals', {
                lat: parseFloat(patientLocation.split(',')[0]),
                long: parseFloat(patientLocation.split(',')[1]),
                limit_count: 10
            });
        if (error) throw error;

        // 3. 선택된 병원들의 requests 배열에 환자 ID 추가
        for (const hospital of nearbyHospitals) {
            const currentRequests = hospital.requests || [];
            const { error: updateError } = await this.supabase
                .from('hospitals')
                .update({
                    requests: [...currentRequests, patientId]
                })
                .eq('id', hospital.id);

            if (updateError) throw updateError;
        }

        return nearbyHospitals;
    }

}

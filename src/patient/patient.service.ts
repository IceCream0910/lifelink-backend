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

    async sendRequests(patientId: string): Promise<any> {
        const { data: patient, error: patientError } = await this.supabase
            .from('patients')
            .select('*')
            .eq('id', patientId)
            .single();
        if (patientError) throw patientError;

        const { lat, long } = patient;

        const { data: nearbyHospitals, error } = await this.supabase
            .rpc('find_nearest_hospitals', {
                input_lat: lat,
                input_long: long,
                limit_count: 10
            });
        if (error) throw error;

        for (const hospital of nearbyHospitals) {
            const { data: hospitalData, error: hospitalError } = await this.supabase
                .from('hospitals')
                .select('*')
                .eq('id', hospital.id)
                .single();
            if (hospitalError) throw hospitalError;

            const { error: insertError } = await this.supabase
                .from('requests')
                .insert({
                    hospital_id: hospital.id,
                    patient_id: patientId,
                    status: 'pending',
                    patient_data: patient,
                    hospital_data: hospitalData,
                    distance: hospital.dist_meters
                })
            if (insertError) throw insertError;
        }

        return nearbyHospitals;

    }
}

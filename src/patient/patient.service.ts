import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Patient } from './patient.entity';

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
}
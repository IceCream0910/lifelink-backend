import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Hospital } from './hospital.entity';

@Injectable()
export class HospitalService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY);
    }

    async findAll(): Promise<Hospital[]> {
        const { data, error } = await this.supabase
            .from('hospitals')
            .select('*');
        if (error) throw error;
        return data;
    }

    async findOne(id: number): Promise<Hospital> {
        const { data, error } = await this.supabase
            .from('hospitals')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    async create(hospital: Partial<Hospital>): Promise<Hospital> {
        const { data, error } = await this.supabase
            .from('hospitals')
            .insert(hospital)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async update(id: number, hospital: Partial<Hospital>): Promise<Hospital> {
        const { data, error } = await this.supabase
            .from('hospitals')
            .update(hospital)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async remove(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('hospitals')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}
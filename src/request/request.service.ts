import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Request } from './request.entity';

@Injectable()
export class RequestService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY);
    }

    async findAll(): Promise<Request[]> {
        const { data, error } = await this.supabase.from('requests').select('*');
        if (error) throw error;
        return data;
    }

    async findOne(id: number, type: string): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('requests')
            .select('*')
            .eq(type, id)
        if (error) throw error;
        return data;
    }

    async create(patient: Partial<Request>): Promise<Request> {
        const { data, error } = await this.supabase
            .from('requests')
            .insert(patient)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async update(id: number, request: Partial<Request>): Promise<void> {
        const { error } = await this.supabase
            .from('requests')
            .update(request)
            .eq('id', id)
            .select()
        if (error) throw error;
    }

    async remove(id: number, type: string): Promise<void> {
        const { error: updateError } = await this.supabase
            .from('requests')
            .update({ status: 'deleted' })
            .eq(type, id)
            .neq('status', 'completed')
        if (updateError) throw updateError;

        const { error: deleteError } = await this.supabase
            .from('requests')
            .delete()
            .eq(type, id)
            .neq('status', 'completed')
        if (deleteError) throw deleteError;
    }

    async removeAll(id: number, type: string): Promise<void> {
        const { error: deleteError } = await this.supabase
            .from('requests')
            .delete()
            .eq(type, id)
        if (deleteError) throw deleteError;
    }


}
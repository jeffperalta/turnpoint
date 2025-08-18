import { Client } from '../models/Client';
import { BaseService } from './BaseService';
import { ServiceResponse } from './ServiceResponse'

export class ClientService extends BaseService {
  constructor(){
    super('/api/clients')
  }

  async getAll(): Promise<Client[]> {
    try {
      const response = await this.api.get('/');
      return response.data.map((item: any) => Client.deserialize(item));
    } catch (err: any) {
      console.error('Failed to fetch client records.');
      return [];
    }
  }

  async getById(id: number): Promise<Client> {
    try {
      const response = await this.api.get(`/${id}`);
      return Client.deserialize(response.data);
    } catch (err: any) {
      console.error('Failed to fetch client record.');
      return new Client();
    }
  }

  async create(client: Client): Promise<ServiceResponse> {
    try {
      await this.api.post('/', client.serialize());
      return {
        data: client,
        success: true,
        message: 'Client record successfully created.',
      };
    } catch (err: any) {
      return {
        data: null,
        success: false,
        message: err.response?.data?.error 
          || 'Failed to create the client record.',
      };
    }
  }

  async update(id: number, client: Client): Promise<ServiceResponse> {
    try {
      await this.api.put(`/${id}`, client.serialize());
      return {
        data: client,
        success: true,
        message: 'Client record successfully updated.',
      };
    } catch (err: any) {
      return {
        data: null,
        success: false,
        message: err.response?.data?.error 
          || 'Failed to update the client record.',
      };
    }
  }

  async delete(id: number): Promise<ServiceResponse> {
    try {
      await this.api.delete(`/${id}`);
      return {
        data: null,
        success: true,
        message: 'Client record successfully deleted.',
      };
    } catch (err: any) {
      return {
        data: null,
        success: false,
        message: err.response?.data?.error 
          || 'Failed to delete the client record.',
      };
    }
  }
}
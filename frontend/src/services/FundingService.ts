import { BaseService } from "./BaseService";
import { Funding } from "../models/Funding";
import { ServiceResponse } from "./ServiceResponse";

export class FundingService extends BaseService {
  constructor() {
    super('/api/fundings')
  }

  async getAll(): Promise<Funding[]> {
    try {
      const response = await this.api.get('/');
      return response.data.map((item: any) => Funding.deserialize(item));
    } catch (err: any) {
      console.error('Failed to fetch funding records.');
      return [];
    }
  }

  async checkElibility(payload: any): Promise<ServiceResponse> {
      try {
        const response = await this.api.post('/check-eligibility', payload);
        return {
          data: new Funding(response.data),
          success: true,
          message: 'Okay',
        };
      } catch (err: any) {
        return {
          data: null,
          success: false,
          message: err.response?.data?.error 
            || 'Failed to check funding eligibility.',
        };
      }
    }
}

const fundingService = new FundingService();
export default fundingService;

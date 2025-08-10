import { BaseService } from "./BaseService";
import { Funding } from "../models/Funding";

export class FundingService extends BaseService {
  constructor() {
    super('/api/fundings')
  }

  async getAll(): Promise<Funding[]> {
    try {
      const response = await this.api.get('/');
      return response.data.map((item: any) => Funding.deserialize(item));
    } catch (err: any) {
      throw new Error('Failed to fetch funding records.');
    }
  }
}
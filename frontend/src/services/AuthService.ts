import { BaseService } from "./BaseService";
import { User } from '../models/User';
import { setSessionToken } from "../utility/SessionUtil";
import { ServiceResponse } from "./ServiceResponse";

export class AuthService extends BaseService {
  constructor() {
    super('/api/auth')
  }

  async logIn(user: User): Promise<ServiceResponse> {
    try {
      const response = await this.api.post('/login', user.serialize());
      setSessionToken(response.data.sessionToken);
      return {
        data: User.deserialize(response.data.user),
        success: true,
        message: 'Login successful'
      };
    } catch (err: any) {
      return {
        data: null,
        success: false,
        message: err.response?.data?.error 
          || 'Failed to login.',
      };
    }
  }
}
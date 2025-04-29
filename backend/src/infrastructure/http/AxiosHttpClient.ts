import axios from 'axios';
import { IHttpClient } from '../../domain/interface/IHttpClient';

export class AxiosHttpClient implements IHttpClient {
  async put(url: string, data: any, config: any): Promise<void> {
    await axios.put(url, data, config);
  }

  async post(url: string, data: any): Promise<any> {
    const response = await axios.post(url, data);
    return response.data;
  }
}
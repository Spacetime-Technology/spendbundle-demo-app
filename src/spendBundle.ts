import axios, { AxiosInstance } from 'axios';
import { config } from './config';

interface CoinDto {
  parent_coin_info: string;
  puzzle_hash: string;
  amount: number;
}

interface CoinSpendDto {
  coin: CoinDto;
  puzzle_reveal: string;
  solution: string;
}

interface SpendBundleDto {
  aggregated_signature: string;
  coin_spends: CoinSpendDto[];
}

interface SingletonDto {
  network: 'mainnet' | 'testnet11';
  innerPuzzle: string;
  submit: boolean;
}

interface SingletonResponseDto {
  spendBundle: SpendBundleDto;
  submitted: boolean;
}

interface FeesDto {
  network: 'mainnet' | 'testnet11';
  spendBundle: SpendBundleDto;
  submit: boolean;
}

interface FeesResponseDto {
  spendBundle: SpendBundleDto;
  fees: number;
  submitted: boolean;
}

type SpendState =
  | 'pending'
  | 'submitted'
  | 'cancelling'
  | 'cancelled'
  | 'expired'
  | 'error';

interface SpendDto {
  id: string;
  userId: string;
  network: 'mainnet' | 'testnet11';
  type: 'fees';
  state: SpendState;
  fees: number;
  coins: string[];
}

interface SpendsResponseDto {
  spends: SpendDto[];
}

class SpendBundle {
  private client: AxiosInstance;
  private apiKey = config.spendBundle.credentials.apiKey;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.spendbundle.com',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(requestConfig => {
      requestConfig.headers['x-api-key'] = this.apiKey;

      return requestConfig;
    });
  }

  /**
   * Mint a new singleton
   */
  async createSingleton(data: SingletonDto): Promise<SingletonResponseDto> {
    const response = await this.client.post<SingletonResponseDto>(
      '/singleton',
      data,
    );
    return response.data;
  }

  /**
   * Calculate and attach fees to a spend bundle
   */
  async fees(data: FeesDto): Promise<FeesResponseDto> {
    const response = await this.client.post<FeesResponseDto>('/fees', data);
    return response.data;
  }

  /**
   * Get spends for the authenticated user
   */
  async getSpends(
    network: 'mainnet' | 'testnet11',
    state: SpendState,
  ): Promise<SpendsResponseDto> {
    const response = await this.client.get<SpendsResponseDto>('/spends', {
      params: { network, state },
    });
    return response.data;
  }

  /**
   * Cancel a spend by ID
   */
  async cancelSpend(spendId: string): Promise<void> {
    await this.client.delete(`/spends/${spendId}`);
  }
}

export default new SpendBundle();

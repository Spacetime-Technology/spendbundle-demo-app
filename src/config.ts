import { SecretKey } from 'chia-wallet-sdk';

import 'dotenv/config';

const EXAMPLE_PRIVATE_KEY =
  '1111111111111111111111111111111111111111111111111111111111111111';

export const config = {
  wallet: {
    privateKey: SecretKey.fromBytes(
      Buffer.from(process.env.PRIVATE_KEY || EXAMPLE_PRIVATE_KEY, 'hex'),
    ),
  },
  spendBundle: {
    credentials: {
      apiKey: process.env.SPENDBUNDLE_API_KEY || '',
    },
  },
};

import { Agent as HttpsAgent } from 'https';
import { RPCAgent } from 'chia-agent';
import { get_coin_records_by_puzzle_hash } from 'chia-agent/api/rpc/full_node';

const agent = new RPCAgent({
  service: 'full_node',
  httpsAgent: new HttpsAgent({
    host: 'testnet11.api.coinset.org',
    port: 443,
    rejectUnauthorized: false,
  }),
  skip_hostname_verification: true,
});

export async function getCoinRecords(puzzleHash: string) {
  // @ts-ignore
  const { coin_records } = await get_coin_records_by_puzzle_hash(agent, {
    puzzle_hash: puzzleHash,
  });

  return coin_records;
}

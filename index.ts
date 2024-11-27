import { ClvmAllocator, fromHex, PublicKey, toHex } from 'chia-wallet-sdk';
import { config } from './src/config';
import { getCoinRecords } from './src/coinset';
import spendBundleApi from './src/spendBundle';
import { coinName } from './src/utils';

const { wallet } = config;
const { privateKey } = wallet;

const TESTNET11_GENESIS_CHALLENGE = fromHex(
  '37a90eb5185a9c4439a91ddc98bbadce7b4feba060d50116a067de66bf236615',
);
const MESSAGE = Buffer.from('Signed Message', 'utf-8');

/**
 * Create delegated spend which sends an amount to a puzzlehash and makes a coin announcement.
 *
 * @param puzzleHash target
 * @param amount sent
 * @param publicKey to sign spend
 * @returns
 */
function delegatedSpend(
  puzzleHash: Uint8Array,
  amount: bigint,
  publicKey: PublicKey,
) {
  const clvm = new ClvmAllocator();
  const conditions = [
    clvm.createCoin(puzzleHash, amount, [puzzleHash]),
    clvm.createCoinAnnouncement(fromHex('ff')),
    clvm.aggSigMe(publicKey, MESSAGE),
  ];

  return clvm.delegatedSpendForConditions(conditions);
}

const targetPuzzleHash = fromHex(
  '764041950bbf547ce728743af77af2cdcd65eb6ff0a72ac6ae9bc73d7147d4ae',
);
const amount = 1n;

const spend = delegatedSpend(targetPuzzleHash, amount, privateKey.publicKey());

const puzzleHash = toHex(spend.puzzle.treeHash());

(async () => {
  const coinRecords = await getCoinRecords(puzzleHash);

  if (coinRecords.length === 0) {
    console.log(`No funds available. Fund address: ${puzzleHash}`);
  } else {
    const { coin } = coinRecords[0];

    const signature = privateKey.sign(
      Buffer.concat([MESSAGE, coinName(coin), TESTNET11_GENESIS_CHALLENGE]),
    );

    const spendBundle = {
      aggregated_signature: `0x${toHex(signature.toBytes())}`,
      coin_spends: [
        {
          coin: {
            ...coin,
            amount: Number(coin.amount),
          },
          puzzle_reveal: `0x${toHex(spend.puzzle.serialize())}`,
          solution: `0x${toHex(spend.solution.serialize())}`,
        },
      ],
    };

    await spendBundleApi.login(config.spendBundle.credentials);

    const { spends: pendingSpends } = await spendBundleApi.getSpends(
      'testnet11',
      'pending',
    );

    if (pendingSpends.length > 0) {
      console.log(`${pendingSpends.length} pending spends exist`);

      for (const pendingSpend of pendingSpends) {
        await spendBundleApi.cancelSpend(pendingSpend.id);

        console.log(`Deleted pending spend with id: ${pendingSpend.id}`);
      }
    }

    while (true) {
      const { spends: cancellingSpends } = await spendBundleApi.getSpends(
        'testnet11',
        'cancelling',
      );

      if (cancellingSpends.length === 0) {
        break;
      }

      console.log(
        `${cancellingSpends.length} cancelling spends exist - will keep polling until cancelled`,
      );

      // Wait 5 seconds and check cancelling spends again
      await new Promise(r => setTimeout(() => r(null), 10000));
    }

    try {
      const result = await spendBundleApi.fees({
        network: 'testnet11',
        spendBundle,
        submit: false,
      });

      console.log(
        `SpendBundle with ${result.fees} fees attached: ${JSON.stringify(result.spendBundle)}`,
      );
    } catch (err) {
      console.log((err as any).response.data);
    }
  }
})();

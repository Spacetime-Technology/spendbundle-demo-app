import { createHash } from 'crypto';

export function stripHexPrefix(str: string) {
  return str.startsWith('0x') ? str.slice(2) : str;
}

export function hexToBuffer(hex: string) {
  return Buffer.from(stripHexPrefix(hex), 'hex');
}

export function stdHash(...data: Buffer[]) {
  const hash = createHash('sha256');

  hash.update(Buffer.concat([...data]));

  return hash.digest();
}

function check(val: any) {
  return val & 0x80 ? 0xff : 0;
}

export function bigIntBuffer(n: bigint) {
  if (n === 0n) {
    return Buffer.alloc(0);
  }

  const initialbuffer = Buffer.alloc(16);

  initialbuffer.writeBigUInt64BE(n, 8);

  let result = initialbuffer;

  while (result.byteLength > 1 && result[0] === check(result[1])) {
    result = result.subarray(1);
  }

  return result;
}

export function coinName(coin: any) {
  return stdHash(
    hexToBuffer(coin.parent_coin_info),
    hexToBuffer(coin.puzzle_hash),
    bigIntBuffer(BigInt(coin.amount)),
  );
}

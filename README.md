# SpendBundle Demo App

This demo application generates an address for a puzzle which;

- Sends TXCH to an address
- Requires a signatures to be spent
- Makes a coin announcement

Upon funding this address the application will create a spend bundle which spends a coin of this address and sends that spend bundle to the [SpendBundle.com](https://www.spendbundle.com/) API.

The [SpendBundle.com](https://www.spendbundle.com/) API returns a modified spend bundle with fees attached.

## Requirements

- [SpendBundle.com](https://www.spendbundle.com/) account
- testnet11 TXCH to find the address

## How to run

### 1. Install Dependencies

```
npm i
```

### 2. Run the first time

```
npm run start
```

Returns:

```
No funds available. Fund address: d9974e2d6d16dcdfc1ba372ac6f1a648e0139ab14724abd1d28fda689a57a696
```

### 3. Fund the address

Send TXH to the address `d9974e2d6d16dcdfc1ba372ac6f1a648e0139ab14724abd1d28fda689a57a696`

### 4. Run the second time

```
npm run start
```

Returns:

```
SpendBundle with 1000160 fees attached: {"aggregated_signature":"0x831ae6379558aa3a6c265399ba01a6fdc85ef6c0bfa42cbe93a0cd5227d6da6465005511b08e99deb944f665c95ec756190e710f648f051f669230899162be7750818afa0348715684e6c0a266d0cae3eb3bb0dcbbb2824428745dd97cc55013","coin_spends":[{"coin":{"amount":50000000,"parent_coin_info":"0xeccadb0852205d657dc59d276c24fc1ecb34d9f2b4816570c21b18b7f373eb36","puzzle_hash":"0x72c529966d294b49cbedbab59038e87bed3e4c53d1e0a2120ef6d41ed9d30a72"},"puzzle_reveal":"0xff01ffff33ffa0764041950bbf547ce728743af77af2cdcd65eb6ff0a72ac6ae9bc73d7147d4aeff01ffffa0764041950bbf547ce728743af77af2cdcd65eb6ff0a72ac6ae9bc73d7147d4ae8080ffff3cff81ff80ffff32ffb097248533cef0908a5ebe52c3b487471301bf6369010e6167f63dd74feddac2dfb5336a59a331d38eb0e454d6f6fcb1a4ff8e5369676e6564204d6573736167658080","solution":"0x80"},{"coin":{"amount":10000000,"parent_coin_info":"0x2dcadd272943b848a3bfc5d89430ba6054a0e643a210a40299efe176e1fd22a3","puzzle_hash":"0xffecacdf6faba053b39138927fc05fcc7e440587e74a09f4fa8e47b1cf050936"},"puzzle_reveal":"0xff02ffff01ff02ffff01ff04ffff04ff04ffff04ff05ffff04ffff02ff06ffff04ff02ffff04ff0bff80808080ff80808080ffff02ff0bff178080ffff04ffff01ff32ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff06ffff04ff02ffff04ff09ff80808080ffff02ff06ffff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080ffff04ffff01b0a7e75af9dd4d868a41ad2f5a5b021d653e31084261724fb40ae2f1b1c31c778d3b9464502d599cf6720723ec5c68b59dff018080","solution":"0xffff01ffff3dffa0295390ab7c5c180ee0bdbaaf94fb7d38a90e1811a7a0a5a61921c77a33aaf0b680ffff34ff830f42e080ffff33ffa0ffecacdf6faba053b39138927fc05fcc7e440587e74a09f4fa8e47b1cf050936ff84008953a0ffff96737061636574696d65746563686e6f6c6f67792e6165ff8f7370656e6462756e646c652e636f6d808080ff8080"}]}
```

## Notes

Your account likely has a limit of only 1 concurrent spend at a time. The application handles this situation but will need to wait for on-chain actions to occur before being able to create additional spend bundles.

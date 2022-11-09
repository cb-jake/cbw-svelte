<script>
  import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

  const sdk = new CoinbaseWalletSDK({ appName: "mytestapp" })
  const provider = sdk.makeWeb3Provider("", 5);

const handleClick = async () => {
    const response = await provider.enable();
    console.log('response', response);
}
  export let name;

</script>

<p>Hello {name}</p>
<button on:click={handleClick}>Connect</button>

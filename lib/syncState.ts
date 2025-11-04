// lib/syncState.ts
export async function syncState(): Promise<void> {
  if (typeof window === "undefined") {
    console.warn("webClient() can only run in the browser");
    return;
  }

  // dynamic import → only in the browser, so WASM is loaded client‑side
  const { WebClient, AccountId } = await import("@demox-labs/miden-sdk");

  const nodeEndpoint = "https://rpc.testnet.miden.io";
  const client = await WebClient.createClient(nodeEndpoint);

  const state = await client.syncState();
  console.log("Latest block number:", state.blockNum());

  const faucetAccountId = AccountId.fromHex("0x83592005c13d47203ec1e3124c654d");
  const faucetAccount = await client.getAccount(faucetAccountId);
  if (!faucetAccount) {
    await client.syncState();
    await client.importAccountById(faucetAccountId);
    console.log("Faucet imported");
  }

  const walletAccountId = AccountId.fromHex("0x1d5f9551dff573102525903e0e928f");
  const walletAccount = await client.getAccount(walletAccountId);
  if (!walletAccount) {
    await client.syncState();
    await client.importAccountById(walletAccountId);
    console.log("Wallet imported");
  }

  setInterval(async () => {
    try {
      const syncSummary = await client.syncState();
      console.log("blockNum", syncSummary.blockNum());
    } catch (error) {
      console.error(error);
    }
  }, 2000);
}

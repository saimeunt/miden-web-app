// lib/deployCounterContractRust.ts
import { noAuthCode, txScriptCode } from "@/lib/scripts";
import counterContractRustCode from "@/lib/counterContractRustCode";

export async function deployCounterContractRust(): Promise<void> {
  const {
    TransactionKernel,
    AccountComponent,
    StorageSlot,
    AccountBuilder,
    AccountStorageMode,
    WebClient,
    AssemblerUtils,
    TransactionScript,
    TransactionRequestBuilder,
    Word,
    StorageMap,
  } = await import("@demox-labs/miden-sdk");
  //
  const assembler = TransactionKernel.assembler().withDebugMode(true);
  const noAuthComponent = AccountComponent.compile(
    noAuthCode,
    assembler,
    []
  ).withSupportsAllTypes();

  const key = new Word(BigUint64Array.from([0n, 0n, 0n, 1n]));
  const value = new Word(BigUint64Array.from([0n, 0n, 0n, 1n]));
  const storageMap = new StorageMap();
  storageMap.insert(key, value);

  const counterComponent = AccountComponent.compile(
    counterContractRustCode,
    assembler,
    [StorageSlot.map(storageMap)]
  ).withSupportsAllTypes();
  const initSeed = new Uint8Array(32);
  crypto.getRandomValues(initSeed);
  const { account: counterContractAccount, seed } = new AccountBuilder(initSeed)
    .storageMode(AccountStorageMode.public())
    .withAuthComponent(noAuthComponent)
    .withComponent(counterComponent)
    .build();

  const client = await WebClient.createClient();
  console.log("Current block number: ", (await client.syncState()).blockNum());
  await client.newAccount(counterContractAccount, seed, false);

  // Creating the library to call the counter contract
  let counterComponentLib = AssemblerUtils.createAccountComponentLibrary(
    assembler, // assembler
    "external_contract::counter_contract", // library path to call the contract
    counterContractRustCode // account code of the contract
  );

  // Creating the transaction script
  let txScript = TransactionScript.compile(
    txScriptCode,
    assembler.withLibrary(counterComponentLib)
  );

  // Creating a transaction request with the transaction script
  let txIncrementRequest = new TransactionRequestBuilder()
    .withCustomScript(txScript)
    .build();

  // Executing the transaction script against the counter contract
  let txResult = await client.newTransaction(
    counterContractAccount.id(),
    txIncrementRequest
  );

  // Submitting the transaction result to the node
  await client.submitTransaction(txResult);

  // Sync state
  await client.syncState();

  // Logging the count of counter contract
  let counter = await client.getAccount(counterContractAccount.id());

  const count = counter
    ?.storage()
    .getMapItem(0, new Word(BigUint64Array.from([0n, 0n, 0n, 1n])));
  const counterValue = Number(
    BigInt("0x" + count!.toHex().slice(-16).match(/../g)!.reverse().join(""))
  );
  console.log("Count: ", counterValue);
}

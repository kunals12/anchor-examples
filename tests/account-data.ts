import * as anchor from "@coral-xyz/anchor";
import { AccountData } from "../target/types/account_data";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
const IDL = require("../target/idl/account_data.json");
const accountDataAddress = new PublicKey(
  "8NvteZcroHN4inQuuHjNjch3SrPhBuKEa558sz8k8jUv"
);

describe("account-data", () => {
  let context: any;
  let provider: BankrunProvider;
  let accountDataProgram: anchor.Program<AccountData>;
  const addressInfoAccount = Keypair.generate();

  before(async () => {
    context = await startAnchor(
      "",
      [{ name: "account_data", programId: accountDataAddress }],
      []
    );
    provider = new BankrunProvider(context);
    accountDataProgram = new anchor.Program<AccountData>(IDL, provider);
  });

  // Generate a new keypair for the addressInfo account

  it("Create the address info account", async () => {
    console.log(`Payer Address      : ${provider.wallet.publicKey}`);
    console.log(`Address Info Acct  : ${addressInfoAccount.publicKey}`);

    // Instruction Ix data
    const addressInfo = {
      name: "Joe C",
      houseNumber: 136,
      street: "Mile High Dr.",
      city: "Solana Beach",
    };

    await accountDataProgram.methods
      .createAddressInfo(
        addressInfo.name,
        addressInfo.houseNumber,
        addressInfo.street,
        addressInfo.city
      )
      .accounts({
        owner: provider.wallet.publicKey,
        addressInfo: addressInfoAccount.publicKey,
      })
      .signers([addressInfoAccount])
      .rpc();
  });

  it("Read the new account's data", async () => {
    const addressInfo = await accountDataProgram.account.addressInfo.fetch(
      addressInfoAccount.publicKey
    );
    console.log(`Name     : ${addressInfo.name}`);
    console.log(`House Num: ${addressInfo.houseNumber}`);
    console.log(`Street   : ${addressInfo.street}`);
    console.log(`City     : ${addressInfo.city}`);
  });
});

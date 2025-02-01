import * as anchor from "@coral-xyz/anchor";
import { Context, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Voting } from "../target/types/voting";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
const IDL = require("../target/idl/voting.json");
const votingAddress = new PublicKey(
  "EvC4qfru7mTT8ZDRoDCTTk9Zy9pqVALj53ievsSLgX7v"
);

describe("voting", () => {
  let context: any;
  let votingProgram: Program<Voting>;
  let provider: BankrunProvider;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "voting_program", programId: votingAddress }],
      []
    );
    provider = new BankrunProvider(context);
    votingProgram = new Program<Voting>(IDL, provider);
  });

  it("Initialize Poll", async () => {
    const currentTimeInUnix = Math.floor(Date.now() / 1000);
    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1),
        new anchor.BN(currentTimeInUnix),
        new anchor.BN(1738392109),
        "What is your favorite canditate"
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.pollStart.toNumber()).toEqual(currentTimeInUnix);
    expect(poll.description).toEqual("What is your favorite canditate");
  });
});

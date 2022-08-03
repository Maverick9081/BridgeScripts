import  express  from "express";
import * as anchor from "@project-serum/anchor";
import pkgg from "@project-serum/anchor"
const  {BN} = pkgg; 
import pkg from "@solana/web3.js"
import { Buffer } from "buffer";
const { Connection,Keypair,LogsFilter,clusterApiUrl, PublicKey,Transaction,TransactionInstruction,sendAndConfirmTransaction,web3} = pkg;
import fs from "fs";



const app = express();

  const secretKey = fs.readFileSync(
    "/home/Abhi/hii.json",
    "utf8"
  );
  const keypair = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(JSON.parse(secretKey))
  );
 
  const walletWrapper = new anchor.Wallet(keypair);

  const contract = new PublicKey("6x3eDRVYWtsXyDdjKp971BKAYNd2FmfvbDoYV7RtGVgs")
  
  const commitment = 'processed';
  const connection = new anchor.web3.Connection('https://api.devnet.solana.com');
  const options = anchor.AnchorProvider.defaultOptions();
  const provider = new anchor.AnchorProvider(connection, walletWrapper, options);
  const idl = await anchor.Program.fetchIdl(
    contract,
    provider,
  );

  const program = new anchor.Program(
    idl,
    contract,
    provider,
  );
 
  const amount = new BN(1);
  const sender = new PublicKey("U4NHM8DNT3kCNrRtB9ymgt1mcR6RBaHwUHWLoxM4KTF");
  const senderAta = new PublicKey("D6j2z6mg5sqzzjaGXmrDC7aXLjpDFnH9fdWTT8B4n1HB");
  const mint = new PublicKey("5ncGkiTtRERfeaTQq7YeEPJQFS2M7wfRXyNUEYDbV45h");
  const vaultAccount = new PublicKey("2tEzVUcvDejpZruu5o3t9EfxueVYchDBVzDgKkupBVXT");

  const freezingConfig = new PublicKey('CQVRDruPpPiKwebKFcZSz7wkEit4s6a4Siy75sJNscrs')
  const tokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
  const systemProgram = new PublicKey('11111111111111111111111111111111');
  const rent = new PublicKey("SysvarRent111111111111111111111111111111111");

  const freeze =  await program.methods.freezeToken(amount,2,'hello').accounts({
      sender :sender,
       senderAta :senderAta,
       mint :mint,
       vaultAccount :vaultAccount,
       freezingConfig :freezingConfig,
       tokenProgram :tokenProgram,
       systemProgram : systemProgram, 
       rent :rent
    }
  ).rpc();  


app.listen(3000,console.log("Awaiting orders"));
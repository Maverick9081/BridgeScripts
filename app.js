import  express  from "express";
import * as anchor from "@project-serum/anchor";
import pkgg from "@project-serum/anchor"
const  {BN} = pkgg; 
import pkg from "@solana/web3.js"
import { Buffer } from "buffer";
const { Connection,Keypair,LogsFilter,clusterApiUrl, PublicKey,Transaction,TransactionInstruction,sendAndConfirmTransaction,web3} = pkg;
import fs from "fs"
import { getAssociatedTokenAddress} from "@solana/spl-token";

const app = express();

  const secretKey = fs.readFileSync(
    "/home/Abhi/hii.json",
    "utf8"
  );
  const keypair = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(JSON.parse(secretKey))
  );
 
  const walletWrapper = new anchor.Wallet(keypair);

  const contract = new PublicKey("BJ1Lgyz2R9oqQuUYShkuaNgGf1ZKoeaga2LsgJeuF5zE")
  
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
  const receiver = new PublicKey("U4NHM8DNT3kCNrRtB9ymgt1mcR6RBaHwUHWLoxM4KTF");
  const mint = new PublicKey("98TWYg7K78Lz8b7DZv2fkqePT25msycMDSqX2cJoys6Q");


  const senderAta = await getAssociatedTokenAddress(mint,sender);

  const receiverAta = await getAssociatedTokenAddress(mint,receiver);
  
  const vaultAccount = await PublicKey.findProgramAddress([
      Buffer.from("vault"),
      mint.toBuffer()
      ],
      contract
  )
 
  const freezingConfig = await PublicKey.findProgramAddress([
      Buffer.from("config"),
      mint.toBuffer()
      ],
      contract
  )
  const tokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
  const systemProgram = new PublicKey('11111111111111111111111111111111');
  const rent = new PublicKey("SysvarRent111111111111111111111111111111111");

  const authority = await PublicKey.findProgramAddress([
      Buffer.from("escrow")
      ],
      contract
  )

  // const freeze =  await program.methods.freezeToken(amount,2,'hello').accounts({
  //     sender :sender,
  //      senderAta :senderAta,
  //      mint :mint,
  //      vaultAccount :vaultAccount[0],
  //      freezingConfig :freezingConfig[0],
  //      tokenProgram :tokenProgram,
  //      systemProgram : systemProgram, 
  //      rent :rent
  //   }
  // ).rpc(); 
  // console.log(freeze);
  const release = await program.methods.releaseToken(amount).accounts({
      receiver : receiver,
      sender :sender,
       receiverAta :receiverAta,
       mint :mint,
       vaultAccount :vaultAccount[0],
       vaultAuthority : authority[0],
       freezingConfig :freezingConfig[0],
       tokenProgram :tokenProgram,
       systemProgram : systemProgram, 
       rent :rent
  }).rpc()

  console.log(release);


app.listen(3000,console.log("Awaiting orders"));
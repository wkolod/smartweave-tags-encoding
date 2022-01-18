const { default: ArLocal } = require("arlocal");
const Arweave = require("arweave");
const { SmartWeaveNodeFactory, LoggerFactory } = require("redstone-smartweave");
const axios = require("axios");
const fs = require("fs");

// variables used in the tests
let arLocal = {};
let smartweave = {};
let arweave = {};

let user = {};
let contract = {};

const apiConfig = {
  host: 'localhost',
  port: '1984',
  protocol: 'http',
  url: 'http://localhost:1984'
};

const mine = () => arweave.api.get("mine");

const getContract = (contractTxId, wallet) => {
  return smartweave
    .contract(contractTxId)
    .setEvaluationOptions({
      internalWrites: true,
      fcpOptimization: true,
      stackTrace: {
        saveState: true
      }
    })
    .connect(wallet);
}

const initUser = async () => {
  const wallet = await arweave.wallets.generate();
  const address = await arweave.wallets.jwkToAddress(wallet);
  const endpoint = `/mint/${address}/100000000000000000000`;
  await axios(apiConfig.url + endpoint);
  return { wallet, address };
};

describe("Testing smartweave transaction tags within the contract", () => {
  beforeAll(async () => {
    // Set up Arweave client
    arweave = Arweave.init(apiConfig);

    // Set up SmartWeave client
    LoggerFactory.INST.logLevel('error');
    smartweave = SmartWeaveNodeFactory.memCached(arweave);

    // Set up testnet 
    arLocal = new ArLocal(1984, false);
    await arLocal.start();

    // Initialise the user
    user = await initUser();
  });

  it("should deploy the contract", async () => {
    const contractSrc = fs.readFileSync('./contract.js').toString();
    const initialState = fs.readFileSync('./initial_state.json').toString();
    const contractId = await smartweave.createContract.deploy({
      wallet: user.wallet,
      initState: initialState,
      src: contractSrc,
    });
    await mine();
    contract = getContract(contractId, user.wallet);
  });

  it("should write a contract interaction", async () => {
    await contract.writeInteraction({
      function: "register",
    }, [], undefined, true);
    await mine();
  });

  afterAll(async () => {
    const stateAfterInteraction = await contract.readState();
    console.log(JSON.stringify(stateAfterInteraction, null, 2));
    await arLocal.stop();
  });
});
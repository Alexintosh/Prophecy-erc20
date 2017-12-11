import { notification } from "onsenui";
import {
  SET_BALANCE,
  SET_MARKET_PRICE,
  RESET_PRICE,
  SET_TRANSACTION_HISTORY
} from "./constants";

const Wallet = window.ethers.Wallet;
const Web3 = require("web3");
const Tx = require('ethereumjs-tx')

import { getTokenPrice } from "../../utils/CryptoCompareApi"
import { getAddressHistory } from "../../utils/ethExplorerApi"
import { showToast } from "../App/actions.js"
import without from 'lodash/without'

const abiELTCOIN = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isPreSaleReady",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "INITIAL_SUPPLY",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_subtractedValue", type: "uint256" }
    ],
    name: "decreaseApproval",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "makePresaleReady",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_addedValue", type: "uint256" }
    ],
    name: "increaseApproval",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { anonymous: false, inputs: [], name: "PreSaleReady", type: "event" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  }
];

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://ropsten.infura.io/Q1GYXZMXNXfKuURbwBWB"
  )
);

const contractAddress = '0xfb5ccddb2098ed2c4096d4acb08fcdbd02503b7f'
const contractInstance = new web3.eth.Contract(
  abiELTCOIN,
  contractAddress
);

export function setBalance(data) {
  return {
    type: SET_BALANCE,
    ELTCOIN: data
  }
}

export function setMarketPrice(gasPrice, neoPrice) {
  return {
    type: SET_MARKET_PRICE,
    gas: gasPrice,
    neo: neoPrice
  }
}

export function resetPrice() {
  return {
    type: RESET_PRICE
  };
}

export function setTransactionHistory(transactions) {
  return {
    type: SET_TRANSACTION_HISTORY,
    transactions
  };
}

export const sendTransaction = (sendAddress, sendAmount, asset = '') => {
  return (dispatch, getState) => {
    const state = getState()

    return web3.eth.getTransactionCount(state.account.account.address).then( count => {
      console.log(`num transactions so far: ${count}`);

      const contract = new web3.eth.Contract(
        abiELTCOIN,
        contractAddress,
        { from: state.account.account.address }
      );


      const finalAmount = (sendAmount * 10 ** 8)
      console.log('finalAmount',finalAmount)
      var rawTransaction = {
          "from": state.account.account.address, //Sender address
          "nonce": "0x" + count.toString(16), // Calculated from previous txs
          "gasPrice": "0x003B9ACA00", // To adjust...
          "gasLimit": "0x250CA",  // To adjust...
          "to": contractAddress, // it's the contractAddress because it's a custom token dummy
          "value": "0x0", // no idea
          // First param: Recipient addres, Second Amount
          "data": contract.methods.transfer(sendAddress, finalAmount).encodeABI(),
          "chainId": 0x03 //0x01 for mainet
      };

      console.log('rawTransaction', rawTransaction)
      
      // Private Key
      const privateKey = new Buffer(state.account.wif, 'hex')
      var tx = new Tx(rawTransaction);
      tx.sign(privateKey);
      const serializedTx = tx.serialize()
      console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);

      return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('transactionHash', function(hash){
            console.log('hash', hash)
            //dipatch(TRANSACTION_HASH RECEIVED)
        })
        .on('receipt', function(receipt){
          console.log('receipt', receipt)
        })
        .on('confirmation', function(confirmationNumber, receipt){
          console.log('confirmationNumber', confirmationNumber)
          console.log('receipt', receipt)
        })
        .on('error', console.error)
    })
  }
};

export function fetchTransaction (pkey, net) {
  return dispatch => getAddressHistory(pkey).then(txs => {
    const res = without(txs.map(o => o.tokenInfo.symbol === 'ELTCOIN'), false)
    dispatch(setTransactionHistory(res))
  })
}

export function fetchMarketPrice () {
  return dispatch =>
    Promise.all([getTokenPrice(), getTokenPrice()]).then(data => {
      dispatch(setMarketPrice(data[0], data[1]));
    });
}

export function fetchBalance(pkey, net = "TestNet") {

  // do we need this? web3.eth.defaultAccount = pkey

  return dispatch =>
    contractInstance.methods
      .balanceOf(pkey)
      .call()
      .then(res => {
        console.log("ELT balance: ", res)
        const balance = (res / 10 ** 8)
        const x = balance.toString().split('.')
        const formatted = parseFloat(x[0] +'.'+ x[1].substr(0,2))
        dispatch(setBalance(formatted))
      })
  // return dispatch => web3.eth.getBalance(pkey).then((res) => {
  //   console.log('ELT balance: ', res);
  //   dispatch(setBalance(res))
  // })
}

import Web3 from 'web3';

//const Web3 = require('web3');
// 直接将 Infura URL 作为参数传入 Web3 构造函数
const INFURA_URL = "https://mainnet.infura.io/v3/7c5b19625ff54c36ba52bff609c40140";
const web3 = new Web3(INFURA_URL);

async function findFirstContractCreationBlock() {
    const latest = await web3.eth.getBlockNumber();
    for (let blockNumber = 0; blockNumber <= latest; blockNumber++) {
        const block = await web3.eth.getBlock(blockNumber, true);
        if (!block || !block.transactions) continue;
        for (let tx of block.transactions) {
            if (tx.to === null) {
                console.log(`First contract creation tx found in block ${blockNumber}`);
                return blockNumber;
            }
        }
    }
    console.log('No contract creation transaction found.');
}

findFirstContractCreationBlock();

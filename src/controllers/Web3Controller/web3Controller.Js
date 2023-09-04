const Web3 = require('web3');
const { abi, networks } = require('./MarketStore.json');

class Web3Controller {
  constructor() {
    this.web3 = new Web3('http://127.0.0.1:7545');
    this.contractAddress = networks['5777']['address']; // Replace with your contract address
    this.marketStoreContract = new this.web3.eth.Contract(abi, this.contractAddress);
   
  }

  async sellProduct(productId, quantity, orderId,price, size, manufacturingMaterial, state, sellerId, buyerId) {
    try {
    
      const numericState = state ? 1 : 0;
      const accounts = await this.web3.eth.getAccounts();
      const result = await this.marketStoreContract.methods
        .sellProduct(productId.toString(), quantity,orderId.toString(), price, size, manufacturingMaterial, numericState, sellerId.toString(), buyerId.toString())
        .send({ from: accounts[0], gas: 3000000 });

     //   console.log(result);
    //  console.log('Product sold:', result.transactionHash);
    } catch (error) {
      console.error('Error selling product:', error);
    }
  }

  async addLoyaltyPoints(totalPrice, userId) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const result = await this.marketStoreContract.methods
        .addLoyaltyPoints(totalPrice, userId.toString())
        .send({ from: accounts[0], gas: 3000000 });

      console.log('Loyalty points added:', result.transactionHash);
    } catch (error) {
      console.error('Error adding loyalty points:', error);
    }
  }

  async removeLoyaltyPoints(totalPrice, userId) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const result = await this.marketStoreContract.methods
        .removeLoyaltyPoints(totalPrice, userId.toString())
        .send({ from: accounts[0], gas: 3000000 });

      console.log('Loyalty points removed:', result.transactionHash);
    } catch (error) {
      console.error('Error removing loyalty points:', error);
    }
  }

  async useLoyaltyPoints(userId, price) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const result = await this.marketStoreContract.methods
        .useLoyaltyPoints(userId.toString(), price)
        .send({ from: accounts[0], gas: 3000000 });

      console.log('Loyalty points used:', result.transactionHash);
    } catch (error) {
      console.error('Error using loyalty points:', error);
    }
  }

  async getLoyaltyPoints(userId) {
    try {
      const points = await this.marketStoreContract.methods.getLoyaltyPoints(userId.toString()).call();

      console.log(`Loyalty points for user ${userId}:`, points);
    } catch (error) {
      console.error('Error getting loyalty points:', error);
    }
  }

  async getPointsTransactionHistory(userId) {
    try {
     const points= await this.marketStoreContract.methods.getPointsTransactionHistory(userId.toString()).call();
  //console.log(`Points transaction history for user ${userId}:`, points);
     
     const extractedData = points.map((entry) => ({
      points: entry[0],
      timestamp: new Date(entry[1] * 1000),
      status: entry[2]?"Awarded":"Withdrawn"
    }));
    return extractedData
     // console.log(`Points transaction history for user ${userId}:`, transactions);
     // return transactions;
    } catch (error) {
      console.error('Error getting points transaction history:', error);
    }
  }

  async getProductHistory(userId, productId, orderId) {
    try {
    
      const product = await this.marketStoreContract.methods.getProductHistory(userId.toString(), productId.toString()).call();
      console.log(product);
      const extractedProductHistory = product
        .filter((entry) => entry[2] === orderId.toString())
        .map((entry) => ({
          quantity: entry[1],
          price: entry[3],
          timestamp: new Date(entry[4] * 1000),
          size: entry[5],
          manufacturingMaterial: entry[6],
          state: entry[7],
          seller: entry[8],
          blockNumber: entry[9]
        }));
  
      // console.log(`Product history for user ${userId}, product ${productId}:`, extractedProductHistory);
      return extractedProductHistory;
    } catch (error) {
      console.error('Error getting product history:', error);
    }
  }
  
  
  
}

module.exports = new Web3Controller();

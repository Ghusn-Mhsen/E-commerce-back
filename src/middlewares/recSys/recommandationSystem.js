const fs = require('fs');

const { NeuralNetwork } = require('brain.js');
const Product = require('../../models/ProductManagment/ProductModel');
const Order = require('../../models/Order/Order');
const modelFilePath = './model.json'; // Path to save/load the model
let model=new NeuralNetwork()
// Function to read data from a CSV file
async function readCSVData(filePath, limit = 300000) {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  const rows = data.split('\n').slice(0, limit);
  const userData = new Set();
  const itemData = [];

  for (const row of rows) {
    const [CustomerNo, TransactionNo, ProductNo, Quantity, Price] = row.split(',');

    const userId = CustomerNo.toString();
    const orderId = TransactionNo.toString();
    const productId = ProductNo.toString();
    const quantity = parseInt(Quantity);
    const price = parseFloat(Price);

    if (quantity >= 0 && price > 0) {
      userData.add(userId);
      itemData.push({ id: productId, orderId, quantity, price });
    }
  }

  return { userData: Array.from(userData), itemData };
}

// Function to create a new neural network model
function createModel() {
  return model;
}

// Function to normalize a rating between 0 and 1
function normalizeRating(rating, min, max) {
  return (rating - min) / (max - min);
}

// Function to train the recommendation model
async function trainModel( userData, itemData) {
  const userIndices = userData.map((u) => parseInt(u));
  const itemIndices = itemData.map((i) => parseInt(i.id));
  const ratings = itemData.map((i) => parseFloat(i.quantity));

  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);

  const trainingData = userIndices.map((userIndex, index) => ({
    input: {
      userIndex,
      itemIndex: itemIndices[index],
      userFeatures: userData[index].features || [],
    },
    output: { rating: normalizeRating(ratings[index], minRating, maxRating) },
  }));

  return new Promise((resolve, reject) => {
    model.train(trainingData, { errorThresh: 0.005, iterations: 200, callback: resolve });
  });
}

// Function to recommend products for a specific user
async function recommendProducts( userId) {
  try {
    const today=new Date()
    const userOrders = await Order.find({ user: userId }).populate('items.product');
    const products = await Product.find({}, {
      _id: 1,
      name: 1,
      description: 1,
      Class: 1,
      Guarantee: 1,
      mainCategorie: 1,
      manufacturingMaterial: 1,
      mainImage: 1,
      descreption:1,
      offers: {
        $elemMatch: {
          startDateOfOffers: { $lte: today },
          endDateOfOffers: { $gte: today },
          ActiveUser: true
        }
      }
    });

    const userItems = new Set();

    userOrders.forEach((order) => {
      order.items.forEach((item) => {
        userItems.add(item.product._id.toString());
      });
    });

    const recommendations = [];

    products.forEach((product) => {
      if (!userItems.has(product._id.toString())) {
        const input = {
          userIndex: parseInt(userId),
          itemIndex: parseInt(product._id),
          userFeatures: null,
        };

        const output = model.run(input);

        recommendations.push({
          product: product,
          rating: output.rating,
        });
      }
    });

    recommendations.sort((a, b) => b.rating - a.rating);

    const topRecommendations = recommendations.slice(0, 10).map((rec) => rec.product);
    topRecommendations.map((element) => { element = addOfferToProduct(element) })
    return topRecommendations
    // console.log(`Recommendations for user with ID: ${userId}`);
    // topRecommendations.forEach((product, index) => {
    //   console.log(`${index + 1}. Product: ${product._id}`);
    // });
  } catch (error) {
    console.error('Error recommending products:', error);
  }
}

// Function to save the model to a file
async function saveModel( filePath) {
  try {
    const modelData = JSON.stringify(model.toJSON());
    await fs.promises.writeFile(filePath, modelData, 'utf-8');
    console.log('Model saved successfully.');
  } catch (error) {
    console.error('Error saving model:', error);
  }
}

// Function to load the model from a file
async function loadModel(filePath) {
  try {
    const modelData = await fs.promises.readFile(filePath, 'utf-8');
    const parsedModel = JSON.parse(modelData);
    const model = createModel();
    model.fromJSON(parsedModel);
    console.log('Model loaded successfully.');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
}

async function loadData() {
  try {
    const filePath = './src/middlewares/recSys/transactions.csv';
    const { userData, itemData } = await readCSVData(filePath);

  

    if (fs.existsSync(modelFilePath)) {
      model = await loadModel(modelFilePath);
    } else {
      model = createModel();
      await trainModel( userData, itemData);
      await saveModel(modelFilePath);
    }

   
  } catch (error) {
    console.error('Error loading data:', error);
  }
}











function addOfferToProduct(product) {
  if (product.offers[0]) {
      //   console.log("iamUnderOffer");
      const valOfDiscount = product.offers[0].valueOfOffer;
      for (let index = 0; index < product.Class.length; index++) {
          const element = product.Class[index];
          product.Class[index].priceAfterDiscount = (product.offers[0].typeOfOffer == "discount") ? element.price - valOfDiscount : element.price - element.price * (valOfDiscount / 100);
          //   console.log(element.priceAfterDiscount);
      }
      product.offers = undefined

  }
  //console.log(product);
  return product
}









module.exports = { loadData ,recommendProducts};

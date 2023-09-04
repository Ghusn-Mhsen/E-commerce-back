const ProductRepositry = require("../../repositories/ProductManagment/ProductRepositry")

module.exports = async (req, res, next) => {
const count = await ProductRepositry.countTrends(req._id)
if (count>=10) return res.json({
    status:false,
    error: 'Your Hot selling is Full (10 Products).To add more,You Must delete some of it' });

    next();
}
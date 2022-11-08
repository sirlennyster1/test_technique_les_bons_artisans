const jwt = require('jsonwebtoken');
const config = require('config');
const Product = require('../models/Product.Model');
const User = require('../models/User.Model');

exports.createProduct = async (req, res) => {
  console.log(req.body);
  const {
    name, type, price, rating, warranty_years,
  } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, config.get('jwtToken'), true);
  const userId = decoded.id;
  User.findById(userId, async (err, user) => {
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    const product = new Product({
      name,
      type,
      price,
      rating,
      warranty_years,
    });
    await product.save();
    const filter = {};
    const all = await Product.find(filter);
    var io = req.app.get('socketio');
    io.emit('created', all);
    return res.status(200).json({ product, createdProduct: true, msg: "The product has been created with success" });
  });
};

exports.getProducts = async (req, res) => {
  const filter = {};
  const all = await Product.find(filter);
  return res.status(200).json({ all });
};

exports.deleteProduct = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, config.get('jwtToken'), true);
  const userId = decoded.id;
  const { id } = req.params;
  User.findById(userId, async (err, user) => {
    if (!user) {
      res.status(401).send('Unauthorized');
    }
    Product.findOneAndDelete(id, async (err) => {
      if (err) {
        return res.status(500).send({ error: 'Problem with this product !' });
      }
      const filter = {};
      const all = await Product.find(filter);
      var io = req.app.get('socketio');
      io.emit('deleted', all);
      return res.status(200).json({
        deletedProduct: true,
      });
    });
  });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  return res.status(200).json({ product });
};

exports.updateProduct = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, config.get('jwtToken'), true);
  const userId = decoded.id;
  console.log(userId);
  User.findById(userId, async (err, user) => {
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    var io = req.app.get('socketio');
    Product.findByIdAndUpdate(req.params.id, req.body, async (err, product) => {
      if (!product) {
        return res.status(404).send('Product not found');
      }
      const updatedProduct = await Product.findOne({ _id: req.params.id });
      io.emit('update', 
          updatedProduct
      )
      const filter = {};
      const all = await Product.find(filter);
      io.emit('updated', all);
      return res.status(200).json({ product, updatedProduct: true });
    });
  });
};
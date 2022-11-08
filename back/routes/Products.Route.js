const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const ProductController = require('../controllers/Product.Controller');

router.post(
  '/create',
  [
    check('name', 'Le nom est requis')
      .not()
      .isEmpty()
      .isLength({ min: 2 }),
    check('type')
      .not()
      .isEmpty(),
    check('price', 'Le prix est requis')
      .not()
      .isEmpty(),
    check('warranty_years', "Le nombre d'années de garantie est requise")
      .not()
      .isEmpty(),
  ],
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    ProductController.createProduct(req, res, next);
  },
);

router.get('/:id', (req, res, next) => {
  ProductController.getProduct(req, res, next);
});

router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ProductController.updateProduct(req, res, next);
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ProductController.deleteProduct(req, res, next);
});

router.get('/', (req, res, next) => {
  ProductController.getProducts(req, res, next);
});

module.exports = router;

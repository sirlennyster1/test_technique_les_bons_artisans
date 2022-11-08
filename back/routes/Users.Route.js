const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const router = express.Router();
const UserController = require('../controllers/User.Controller');

router.post('/login', 
[
    check('email', 'Veuillez entrer un e-mail valide').isEmail(),
    check(
        'password',
        'Veuillez entrer un mot de passe'
    ).exists()
], 
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array() 
    });
  }
  UserController.login(req, res, next);
});

router.post('/register', 
[
  check('email', 'Veuillez entrer un e-mail valide')
  .isEmail(),
  check('password', 'Veuillez entrer un mot de passe à 6 caractères minimum')
  .isLength({ min: 6 }),
  check('username', 'Veuillez entrer un nom d\'utilisateur à 6 caractères minimum')
  .isLength({ min: 6 }),
],
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  UserController.register(req, res);
});

router.get("/get-infos", passport.authenticate('jwt', { session: false }), (req, res) => {
  UserController.getUser(req, res);
});

router.get('/', (req, res) => {
  res.send('User route');
});

module.exports = router;

const config = require('config')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')
const User = require('../models/User.Model')

exports.login = async function (req, res) {
	const user = await User.findOne({ email: req.body.email })
	if (!user) {
		return res.json({ msg: 'Utilisateur non existant', login: false }).status(400)
	} if (!bcrypt.compareSync(req.body.password, user.password)) {
		return res.json({ msg: 'Mot de passe incorrect', login: false }).status(400)
	} const payload = { id: user.id, expire: Date.now() + 1000 * 60 * 60 * 24 * 7,}, token = jwt.encode(payload, config.get('jwtToken'))
	return res.json({ token, msg: 'Connexion réussie avec succès, vous allez être redirigé !', login: true, })
}

exports.getUser = async function (req, res) {
	const token = req.headers.authorization.split(' ')[1]
	const decoded = jwt.decode(token, config.get('jwtToken'), true)
	const userId = decoded.id
	User.findById(userId, async (err, user) => {
		if (!user) {
			return res.status(401).send('Unauthorized')
		}
		return res.status(200).json({ loggedIn: true })
	})
}

exports.register = async function (req, res) {
	const salt = await bcrypt.genSalt(10)
	req.body.password = await bcrypt.hash(req.body.password, salt)
	User.register(
		new User({
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
		}),
		req.body.password,
		(err, user) => {
			if (err) {
				console.log(err)
				if (err.name === 'UserExistsError') res.send({ msg: 'Utilisateur déjà existant, veuillez utiliser une autre adresse électronique', register: false })
			} else {
				const payload = {
					id: user.id,
					email: user.email,
					username: user.username,
					expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
				}
				const token = jwt.encode(payload, config.get('jwtToken'))
				res.send({ msg: 'Successful', register: true, token })
			}
		},
	)
}

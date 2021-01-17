const express = require('express')
// const router  = express.Router()
const router = require('express-promise-router')() //bat loi phuong thuc route null va loai bo try cath bat loi

const UserController = require('../controllers/user')

const { validateParam , schemas, validateBody } = require('../helpers/routerHelpers')

router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema) ,UserController.newUser)

router.route('/signup').post(validateBody(schemas.authSignUpSchema) ,UserController.signUp)

router.route('/signin').post(validateBody(schemas.authSignInSchema) ,UserController.signIn)
    
router.route('/secret').get(UserController.secret)

router.route('/:userID')
    .get(validateParam(schemas.idSchema, 'userID') , UserController.getUser)
    .put(validateParam(schemas.idSchema, 'userID') ,validateBody(schemas.userSchema),UserController.replaceUser)
    .patch(validateParam(schemas.idSchema, 'userID') ,validateBody(schemas.userOptionalSchema),UserController.updateUser)

router.route('/:userID/decks')
    .get(validateParam(schemas.idSchema, 'userID'),UserController.getUserDecks)
    .post(validateParam(schemas.idSchema, 'userID'),validateBody(schemas.deckSchema),UserController.newUserDecks)


module.exports = router
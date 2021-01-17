const Deck = require("../models/Deck")
const User = require("../models/user")


const getUser = async (req ,res ,next) => {
    const { userID } = req.value.params

    const user = await User.findById(userID)

    return res.status(200).json({user})

}

const getUserDecks = async (req, res , next) =>{
    const { userID } = req.value.params
    //get user
    const user = await User.findById(userID).populate('deck')
    return res.status(200).json({deck : user.deck})
}

const index = async (req,res,next) => {
    
        const users = await User.find({})
        return res.status(200).json({users})
  
}

const newUser = async (req , res ,next) =>{
    
        const newUser = new User(req.value.body)
        await newUser.save()
        return res.status(201).json({user: newUser})
   
}

const newUserDecks = async (req, res , next) =>{
    const { userID } = req.value.params
    //create new deck
    const newDeck = new Deck(req.value.body)
    //get user
    const user = await User.findById(userID)
    //assign user as a deck's owner
    newDeck.owner = user
    //Save the deck
    await newDeck.save()
    //Add deckt to user's decks array 'decks'
    user.deck.push(newDeck._id)
    //Save the user
    await user.save()
    res.status(201).json({deck : newDeck})
}

const replaceUser = async (req, res, next) => {
    const { userID } = req.value.params

    const newUser = req.value.body

    const result = await User.findByIdAndUpdate(userID , newUser)

    return res.status(200).json({success: true})

}
const secret = async (req,res,next) =>{
    console.log('Secret function')
}

const signIn = async (req,res,next) =>{
    console.log('Sigin function')
}

const signUp = async (req,res,next) =>{
    const {firstName , lastName , email , password} = req.value.body
    //check user exist?
    const foundUser = await User.findOne({email})
    console.log('found user',foundUser)
    if(foundUser) return res.status(403).json({error: {message: 'Email is already used'}})

    //create a new user
    const newUser = new User({firstName,lastName,email,password})
    console.log(newUser)
    newUser.save()
    return res.status(200).json({success: true})
}


const updateUser = async (req, res, next) => {
    const { userID } = req.value.params

    const newUser = req.value.body

    const result = await User.findByIdAndUpdate(userID , newUser)

    return res.status(200).json({success: true})
}

module.exports = {
    index,
    newUser,
    newUserDecks,
    getUser,
    getUserDecks,
    replaceUser,
    secret,
    signIn,
    signUp,
    updateUser

}
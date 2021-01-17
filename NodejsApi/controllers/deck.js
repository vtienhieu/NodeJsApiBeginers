const Deck = require("../models/Deck")
const User = require("../models/user")


const deleteDeck = async (req,res,next) => {
    const { deckID } = req.value.params

    //get a deck
    const deck = await Deck.findById(deckID)
    const ownerID = deck.owner

    //get a owner
    const owner = await User.findById(ownerID)
    //Remove deck   
    await deck.remove()
    

    //Remove deck from owner's deck list
    owner.deck.pull(deck)
    await owner.save()
    
    return res.status(200).json({success: true})
}

const getDeck = async (req,res,next) => {
    const deck = await Deck.findById(req.value.params.deckID)

    return res.status(200).json({deck})
}


const index = async (req,res,next) => {
    const decks = await Deck.find({})

    return res.status(200).json({decks})
    
  
}

const newDeck = async (req , res ,next) =>{
    //Find owner
    const owner = await User.findById(req.value.body.owner)
    //Create a new deck
    const deck = req.value.body

    delete deck.owner 

    deck.owner = owner._id
    const newDeck = new Deck(deck)
    await newDeck.save()
    //assign new deck to owner
    owner.deck.push(newDeck._id)
    await owner.save()

    return res.status(201).json({deck: newDeck})
}

const replaceDeck = async (req, res, next) => {
    const { deckID } = req.value.params

    const deck = await Deck.findById(deckID)

    const newDeck = req.value.body

    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    // Check if put user, remove deck in user's model
    const ownerID = deck.owner
    const owner = await User.findById(ownerID)
    owner.deck.pull(deck)
    await owner.save()
    // deleted old owner
    //****
    //assign deck to new owner
    const newOwner = await User.findById(newDeck.owner)
    newOwner.deck.push(result._id)
    await newOwner.save()

    return res.status(200).json({ success: true })
}

const updateDeck = async (req,res,next) => {
    const { deckID } = req.value.params
    const deck = await Deck.findById(deckID)

    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID , newDeck)

    if(newDeck.owner){
        const ownerID = deck.owner
        const owner = await User.findById(ownerID)
        owner.deck.pull(deck)
        await owner.save()
        // deleted old owner
        //****
        //assign deck to new owner
        const newOwner = await User.findById(newDeck.owner)
        newOwner.deck.push(result._id)
        await newOwner.save()
    }
    return res.status(200).json({success: true})
}

module.exports = {
    deleteDeck,
    getDeck,
    index,
    newDeck,
    replaceDeck,
    updateDeck
}
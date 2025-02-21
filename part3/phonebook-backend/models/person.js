const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message);
    })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 9,
    validate: {
        validator: function(v) {
          return(/\d{3}-\d{5,}/.test(v) || /\d{2}-\d{6,}/.test(v))
        },
        message: props => `${props.value} is not a valid phone number!`
    },    
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
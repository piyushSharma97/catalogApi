var mongoose = require('mongoose')

const {Schema} = mongoose

const itemSchema =  new Schema({
  itemCode :{
    type: String,
    required: 'This field is required!',
    unique:true
  }  ,
  itemType:{
      type: String,
      required: 'This field is required',
  },
  itemTitle:{
      type: String,
      required: 'This field is required',
  },
  Category: {
      type: String,
      required: 'This field is required',
  },
  itemImages:[{
   type: String,
  }],
  shortDescription:{
      type: String,
  },
  longDescription:{
      type: String,
  },
  available:{
      type: Boolean,
  },
  slug:{
      type: String,
  },
  startDate:{
      type: Date,
  },
  endDate:{
      type: Date,
  }
})

const itemModal = mongoose.model('Items',itemSchema)
module.exports = itemModal
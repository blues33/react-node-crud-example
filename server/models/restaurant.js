import mongoose from 'mongoose';

const RestaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rateAvg: {
    type: Number,
    default: 0,
  },
  highestReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  },
  lowestReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  },
  created: {
    type: Date,
    default: () => new Date()
  },
});

const RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);

export default RestaurantModel;

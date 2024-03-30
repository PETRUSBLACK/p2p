import mongoose from "mongoose";

const schema = mongoose.Schema;

const ReviewSchema = new schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a users"],
    },
    userReviewed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    message: {
      type: String,
      required: [true, "please add a message"],
    },
    rating: {
      type: Number,
      required: [true, "please add a rating between 1 to 5"],
      min: 1,
      max: 5,
    },
  },
 
  { timestamps: true, toJSON: { virtuals: true } }
);
const Review = mongoose.model("Review", ReviewSchema);
export default Review;

import mongoose from 'mongoose'
const schema = mongoose.Schema;

const OTPSchema = new schema({
	user: Object,
	otp: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
	}
})

const OTP = mongoose.model('OTP', OTPSchema);
export default OTP;
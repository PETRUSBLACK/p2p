import mongoose from 'mongoose'
const schema = mongoose.Schema;

const NotificationSchema = new schema({
    message: {
        type: String,
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification
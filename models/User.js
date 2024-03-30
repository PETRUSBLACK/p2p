import mongoose from 'mongoose'
const schema = mongoose.Schema;

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const UserSchema = new schema({
    fullname: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [3, 'fullname must be 3 letters long'],
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    username: {
        type: String,
        minlength: [3, 'Username must be 3 letters long'],
        unique: true
    },
    profile_img: {
        type: String,
        default: () => {
            return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
        }
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    seller_info: {
        no_of_trades: {
            type: Number,
        },
        no_of_completed_trades: {
            type: Number,
        },
        percentage_of_completed_trades: {
            type: Number,
        },
        likes: {
            type: Number
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},

    {
        timestamps: true
    }
)

UserSchema.pre('save', function (next) {
    if (this.seller_info.no_of_trades === 0) {
        this.seller_info.percentage_of_completed_trades = 0;
    } else {
        this.seller_info.percentage_of_completed_trades = (this.seller_info.no_of_completed_trades / this.seller_info.no_of_trades) * 100;
    }

    if (!this.username) {
        this.username = generateUsername(this.fullname);
    }

    next();
});

function generateUsername(fullname) {
    let username = fullname.replace(/\s+/g, '').toLowerCase();
    if (username.length > 10) {
        username = username.substring(0, 10);
    }
    return username;
}

const User = mongoose.model("User", UserSchema);
export default User;
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
    password: String,
    phone: {
        type: String,
        required: true
    },
    username: {
        type: String,
        minlength: [3, 'Username must be 3 letters long'],
        unique: true,
    },
    profile_img: {
        type: String,
        default: () => {
            return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
        } 
    },
    personal_info: {
        address: {
            type: String
        },
        city: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    
    wallet_balance: {
        type: String,
    },

    wallet_address: {
        type: String,
    },
    
    pin: {
        type: String,
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

const User = mongoose.model("User", UserSchema);
export default User;
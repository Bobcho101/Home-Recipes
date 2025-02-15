import mongoose, { Schema, Types, model } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: [2, 'Username should be at least 2 characters long!'],
       maxLength: [20, 'Username should be 20 characters max!']
    },
    email: {
        type: String,
        required: true,
        minLength: [10, 'Email should be at least 10 characters long!'],
    },
    password: {
        type: String,
        required: true,
        minLength: [4, 'Name should be at least 4 characters long!'],
    }
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10);
});


const User = model('User', userSchema);

export default User;
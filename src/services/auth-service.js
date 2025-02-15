import User from "../models/UserModel.js";
import bcrypt from 'bcrypt';

export async function register(username, email, password) {
    const checkIfExistsWithName = await User.findOne({username});
    const checkIfExistsWithEmail = await User.findOne({email});
    if(checkIfExistsWithEmail || checkIfExistsWithName){
        throw new Error('User already exists!')
    }

    const userData = {
        username,
        email,
        password
    }
    const token = await User.create(userData);
    return token;
}

export async function login(email, password){
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Invalid user!')
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        throw new Error('Invalid email or password!')
    }

    return user;
}
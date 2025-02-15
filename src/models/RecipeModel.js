import mongoose, { Schema, Types, model } from "mongoose";
import bcrypt from 'bcrypt';

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: [2, 'Title must be at least 2 characters long!']
    },
    ingredients: {
        type: String,
        required: true,
        minLength: [10, 'Ingredients must be at least 10 characters long!'],
        maxLength: [200, 'Ingredients max characters is 200!']
    },
    instructions: {
        type: String,
        required: true,
        minLength: [10, 'Instructions must be at least 10 characters long!'],
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'Description must be at least 10 characters long!'],
        maxLength: [200, 'Description max characters is 200!']
    },
    image: {
        type: String,
        required: true,
        match: /^https?:\/\//,
    },
    recommendList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner:{
        type: Types.ObjectId,
        ref: 'User'
    },
});

const Recipe = model('Recipe', recipeSchema);

export default Recipe;
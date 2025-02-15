import Recipe from "../models/RecipeModel.js";

export async function createRecipe(data) {
    return await Recipe.create(data);
}

export async function getRecipesHome() {
    return await Recipe.find({}).sort({ _id: 'desc' }).limit(3);
}

export async function getRecipes() {
    return await Recipe.find();
}

export async function getOneRecipe(recipeId) {
    return await Recipe.findOne({'_id': recipeId});
}

export async function updateOneRecipe(recipeId, newData) {
    await Recipe.findByIdAndUpdate(recipeId, newData, { runValidators: true });
}

export async function deleteOneRecipe(recipeId){
    await Recipe.findByIdAndDelete(recipeId);
}

export async function recommendRecipe(recipeId, userId){
    const recipe = await getOneRecipe(recipeId);
    if(recipe.recommendList.includes(userId)){
        throw new Error("This user already preferred this device!");
    }
    recipe.recommendList.push(userId);
    await recipe.save();
}

export async function getRecipesFiltered(filter = {}) {
    const query = {};

    if(filter.search){
        query.title = {$regex: filter.search, $options: "i"};
    }

    
    try {
        const result = await Recipe.find(query);   
        return result;
    } catch (err) {
        console.log(err.message);
    }
}
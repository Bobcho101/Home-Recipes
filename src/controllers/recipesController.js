import { Router } from "express";
import { ObjectId } from "mongodb";
import { isUser } from "../middlewares/auth-middleware.js";
import { createRecipe, deleteOneRecipe, getOneRecipe, getRecipes, getRecipesFiltered, recommendRecipe, updateOneRecipe } from "../services/recipes-service.js";
const recipesController = Router();

recipesController.get('/search', async (req, res) => {
    const filter = req.query;
    const searchString = filter.search;
    try{
        const recipes = await getRecipesFiltered(filter);
        
        return res.render('search', { recipes, searchString });
    } catch(err){
        console.log(err.message);
    }
});


recipesController.get('/recipes/:recipeId/recommend', isUser, async (req, res) => {
    const recipeId = req.params.recipeId;
    const userId = req.user.id; 
    const recipe = await getOneRecipe(recipeId);

    if(userId === recipe.owner.toString()){
        return res.redirect('/404')
    }

    try{
        await recommendRecipe(recipeId, userId);
        return res.redirect(`/recipes/${recipeId}/details`);
    } catch(err){
        console.log(err.message);
        return res.redirect('/404');
    }
});

recipesController.get('/recipes/:recipeId/delete', isUser, async (req, res) => {
    const recipeId = req.params.recipeId;
    const recipe = await getOneRecipe(recipeId);
    if(req.user.id !== recipe.owner.toString()){
        return res.redirect('/404');
    }
    try{
        await deleteOneRecipe(recipeId);
        return res.redirect('/');
    } catch(err){
        console.log(err.message);
    }
    
});

recipesController.get('/recipes/:recipeId/edit', isUser, async (req, res) => {
    const recipeId = req.params.recipeId;
    const recipe = await getOneRecipe(recipeId);
    if(req.user.id !== recipe.owner.toString()){
        return res.redirect('/404');
    }
    res.render('edit', { recipe });
});


recipesController.post('/recipes/:recipeId/edit', isUser, async (req, res) => {
    const data = req.body;
    const recipeId = req.params.recipeId;
    const recipe = await getOneRecipe(recipeId);
    if(req.user.id !== recipe.owner.toString()){
        return res.redirect('/404');
    }
    try{
        await updateOneRecipe(recipeId, data);
        return res.redirect(`/recipes/${recipeId}/details`);
    } catch(err){
        console.log(err.message);
        return res.render('edit', { error: err.message, data })
    }
});

recipesController.get('/recipes/:recipeId/details', async (req, res) => {
    const recipeId = req.params.recipeId;
    const recipe = await getOneRecipe(recipeId);
    const recommendedList = recipe.recommendList;
    const recommendedListLength = recommendedList.length;
    let alreadyRecommended = false;

    if(req.user){
        if(recommendedList.includes(req.user.id)){
            alreadyRecommended = true;
        }
    }
    let isOwner;
    if(!req.user){
        isOwner = false;
    } else{
        isOwner = req.user.id === recipe.owner.toString() ? true : false;
    }
    
    res.render('details', { recipe, isOwner, recommendations: recommendedListLength, alreadyRecommended  });
});

recipesController.get('/recipes', async (req, res) => {
    const recipes = await getRecipes();
    res.render('catalog', { recipes });
});


recipesController.get('/create', isUser, (req, res) => {
    res.render('create');
});
recipesController.post('/create', isUser, async (req, res) => {
    const data = req.body;
    
    try{
        data.owner = req.user.id;
        const newRecipe = await createRecipe(data);
        return res.redirect('/');
    } catch(err){
        console.log(err.message);
        res.render('create', {error: err.message, data})
    }
});


export default recipesController;
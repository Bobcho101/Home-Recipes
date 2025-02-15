import { Router } from "express";
import { getRecipesHome } from "../services/recipes-service.js";
const homeController = Router();


homeController.get('/', async (req, res) => {
    const recipes = await getRecipesHome();
    return res.render('home', { recipes });
});

export default homeController;
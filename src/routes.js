import { Router } from "express";
import authController from "./controllers/authController.js";
import homeController from "./controllers/homeController.js";
import recipesController from "./controllers/recipesController.js";

const routes = Router();

routes.use(authController);
routes.use(homeController);
routes.use(recipesController);
routes.get('*', (req, res) => {
    res.render('404')
});

export default routes;
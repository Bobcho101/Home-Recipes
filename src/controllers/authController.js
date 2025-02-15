import { Router } from "express";
import { login, register } from "../services/auth-service.js";
import { generateToken } from "../utils/authUtils.js";
import { AUTH_COOKIE_NAME, SECRET } from "../utils/magic-strings.js";
import { isGuest, isUser } from "../middlewares/auth-middleware.js";
const authController = Router();


//*register
authController.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

authController.post('/register', isGuest ,async (req, res) => {
    const data = req.body;

    try{
        if(data.password != data.confirmPassword){
            throw new Error('Password missmatched!');
        }
        const newUser = await register(data.username, data.email, data.password);
        const payload = {
            username: newUser.username,
            email: newUser.email,
            id: newUser.id.toString()
        };
        
        const jwtToken = await generateToken(payload);

        res.cookie(AUTH_COOKIE_NAME, jwtToken);
        return res.redirect('/');
    } catch(err){
        console.log(err.message);
        return res.render('auth/register', {error: err.message, data })
    }
});



//*login
authController.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

authController.post('/login', isGuest, async (req, res) => {
    const data = req.body;
    try{
        const user = await login(data.email, data.password);

        const username = user.username;
        const email = user.email;
        const id = user.id.toString();
        const payload = {
            username,
            email,
            id
        };

        const jwtToken = await generateToken(payload);
        res.cookie(AUTH_COOKIE_NAME, jwtToken);

        return res.redirect('/');
    } catch(err){
        console.log(err.message);
        return res.render('auth/login', {error: err.message, data});
    }
    
});


//*logout

authController.get('/logout', isUser, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/');
});


export default authController;
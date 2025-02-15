import { AUTH_COOKIE_NAME, SECRET } from "../utils/magic-strings.js";
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies[AUTH_COOKIE_NAME];
    if(!token){
        return next();
    }

    try{
        const decodedToken = jwt.verify(token, SECRET);
        req.user = decodedToken;
        res.locals.user = decodedToken;

        return next();
    } catch(err){
        console.log(err.message);
        res.clearCookie(AUTH_COOKIE_NAME);
        res.redirect('/404');
    }
};

export const isUser = (req, res, next) => {
    if(!req.user){
        return res.redirect('/login');
    } 
    
    next();
};

export const isGuest = (req, res, next) => {
    if(req.user){
        return res.redirect('/404');
    }
    next();
};
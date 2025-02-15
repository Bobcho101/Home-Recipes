import jwt from 'jsonwebtoken';
import { SECRET } from './magic-strings.js';

export async function generateToken(payload) {
    const token = jwt.sign(payload, SECRET, {expiresIn: '3h'});
    return token;
}
import express from 'express';
import routes from './routes.js';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { mongoUri } from './utils/magic-strings.js';
import { authMiddleware } from './middlewares/auth-middleware.js';
const app = express();
//! CHANGE THE PORT IF IT IS DIFFERENT IN THE EXAM!!!
const PORT = 3000;


app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
}));

app.set('view engine', 'hbs');
app.set('views', 'src/views')

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('src/public'))


try{
    const localUri = mongoUri;
    await mongoose.connect(localUri);
} catch(err){
    console.log(err.message);
}

app.use(authMiddleware);
app.use(routes);

app.listen(PORT, console.log(`http://localhost:${PORT}`));
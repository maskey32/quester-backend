import express, {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/journal';
import usersRouter from './routes/users';
import postRouter from './routes/postRoutes';
import replyRouter from './routes/replyRoutes';
import journalRouter from './routes/journal';
import adminRouters from './routes/adminRoutes';
import cors from 'cors';

import DB from './db/database.config';

DB.sync()
.then(() => { 
    console.log('Connected to SQLite database') 
  })
.catch((err: Error) => console.error(err));

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);
app.use('/reply', replyRouter);
app.use('/journals', journalRouter);
app.use('/admin', adminRouters)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(
   err: createError.HttpError,
   req: Request, 
   res: Response, 
   next: NextFunction
  ) {
  // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
function adminRouter(arg0: string, adminRouter: any) {
  throw new Error('Function not implemented.');
}


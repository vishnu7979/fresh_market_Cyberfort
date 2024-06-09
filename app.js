const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const collection=require("../week_6/models/mongodb")

const indexRouter = require('./routes/admin');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


//section setup

const oneday=1000*60*60*24;

app.use(session({
  secret: 'your-Secret-Key',  
  resave: false,
  cookie:{maxAge:oneday},
  saveUninitialized: true
}));

 
app.use((req,res,next)=>{
  if(!req.user){
    res.header('Cache-Control','private,no-cache,no-store,must-revalidate')
  }
  next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(4789,()=>{
  console.log("http://localhost:4789");
})

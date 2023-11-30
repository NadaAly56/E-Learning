const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');




const instructorRouter = require('./routes/instructor.routes.js');
const studentRouter = require('./routes/student.routes.js')
const waitingListRouter  = require('./routes/waitingList.routes');
const authRouter = require('./routes/auth.routes');
const adminRouter = require("./routes/admin.routes");
const roleRouter = require("./routes/role.routes");
const acceptedListRouter = require('./routes/acceptedList.routes.js');
const programRouter = require('./routes/program.routes');
const rejectedListRouter = require("./routes/rejectedList.routes");
const roundRouter= require('./routes/round.routes.js');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./middlewares/globalErrorHandler.js');
const subCategoryRouter = require("./routes/subCategory.routes.js");
const categoryRouter = require("./routes/category.routes.js");
const {limiterRequest} = require('./middlewares/limiter');
const newsRouter = require('./routes/news.routes.js');
const fileUpload = require('./utils/fileUpload');




//---------------------------------//
const app = express();
app.use(cors())
app.use(express.static(path.join(__dirname,'../uploads')));
app.use(express.urlencoded({ extended: true}))
app.use(express.json());
app.use(hpp())
app.use(helmet())
// To remove data using these defaults:
app.use(mongoSanitize());

//-------------------------------//




app.use('/api/auth', authRouter);
app.use('/api/student', studentRouter);
app.use('/api/instructor', instructorRouter);
app.use('/api/waitingList', waitingListRouter);
app.use("/api/admin",  adminRouter);
app.use("/api/role", roleRouter);
app.use('/api/acceptedList', acceptedListRouter);
app.use('/api/program', programRouter);
app.use("/api/rejectedList", rejectedListRouter);
app.use('/api/round', roundRouter);
app.use("/api/subCategory", subCategoryRouter);
app.use("/api/category",  categoryRouter);
app.use("/api/news", newsRouter);

app.use(fileUpload());
app.all('*', (req, res, next)=>{
    next(new AppError(`Invalid URL: ${req.originalUrl}`, 404))
})
app.use(globalErrorHandler)
//--------------------------------//
module.exports = app;

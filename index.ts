import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { pool } from './db'
import listRouter from './routes/list'

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.on('connect', (client) => {
  console.log('connected')
})

dotenv.config();

const app = express();

const port = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, "public")));

app.use("/list", listRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // 500
  next(createError(404));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

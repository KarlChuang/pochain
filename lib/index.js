const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const blockchain = require('./listeners/blockchain');
const apiGetRouter = require('./apiRouters/getRouter');
const apiPostRouter = require('./apiRouters/postRouter');

const port = process.env.PORT;
const filePath = (process.env.NODE_ENV === 'production') ? '../../' : '../';

const app = express();
const apiRouter = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(session);
// app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());
const router = ['/', '/propose', '/propose/:productId', '/login', '/product/:productId', '/user'];
for (let i = 0; i < router.length; i += 1) {
  app.use(router[i], express.static(path.join(__dirname, filePath, 'public')));
  app.use(router[i], express.static(path.join(__dirname, filePath, 'dist', 'bundle')));
}

// app.use('/auth', authRouter);
apiRouter.use(apiGetRouter);
apiRouter.use(apiPostRouter);
app.use('/api', apiRouter);

app.listen(port || 5000, async () => {
  console.log(`listening on port ${port || 5000}`);
  await blockchain();
});

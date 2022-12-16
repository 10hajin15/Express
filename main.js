const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require('compression')
const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
// 보안
const helmet = require('helmet')
app.use(helmet())

// serving static files in Express
app.use(express.static('public'))

// body-parser가 만들어내는 미들웨어를 표현하는 표현식
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// compress all responses
app.use(compression());

// Writing middleware
app.get('*', function(request, response, next) {
  fs.readdir("./data", function (error, filelist){
    request.list = filelist;
    next();   // next에는 다음에 호출되어야 할 middleware가 담겨있음
  })
})

app.use('/', indexRouter)
// '/topic'으로 시작하는 주소들에게 topicRouter라는 미들웨어를 적용하겠다는 의미
app.use('/topic', topicRouter)

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

// err: next를 통해 전달됨
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

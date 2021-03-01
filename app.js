const Koa = require('koa');
const views = require('koa-views');
const Router = require('koa-router');
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs')

const app = new Koa();
const router = new Router();

const root = path.resolve(__dirname, './src/public');

app.use(views(root));
app.use(koaBody({ multipart: true }));

router.get('/', ctx => ctx.render('index'))

router.post('/upload', async ctx => {
  const file = ctx.request.files.file;
  const render = fs.createReadStream(file.path);
  const filePath = path.join(__dirname, '/src/public/img') + `/${new Date().getTime()}.png`;
  const writer = fs.createWriteStream(filePath);

  const pro = new Promise((resolve, reject) => {
    const stream = render.pipe(writer);

    stream.on('finish', function () {
      resolve({
        message: '保存成功',
        code: 0
      });
    });

    stream.on('error', function (err) {
      console.log("ERROR:" + err);
      reject({
        message: '失败',
        code: 1
      })
    });
  })

  ctx.response.body = await pro

});

app.use(router.routes());
app.use(require('koa-static')(root));

app.listen(3000);
console.log('启动成功')
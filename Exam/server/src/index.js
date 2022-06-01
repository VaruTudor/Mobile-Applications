const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const Router = require('koa-router');
const cors = require('koa-cors');
const bodyparser = require('koa-bodyparser');

app.use(bodyparser());
app.use(cors());
app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
app.use(async (ctx, next) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  await next();
});

const router = new Router();

const messages = Array.from(Array(100).keys()).map(id => ({
  id,
  text: `m${id} to u${id % 10}`,
  sender: `u${id % 10}`,
}));

router.get('/message', ctx => {
  const sender = ctx.request.query.sender;
  ctx.response.body = messages.filter(message =>  message.sender === sender);
  ctx.response.status = 200;
});

router.del('/message/:id', ctx => {
  const id = parseInt(ctx.params.id);
  const index = messages.findIndex(message => message.id === id);
  if (index !== -1) {
    messages.splice(index, 1);
  }
  ctx.response.status = 200;
});

app.use(router.routes());
app.use(router.allowedMethods());

wss.on('connection', ws => {
  console.log('on connection');
  ws.send(JSON.stringify({
    users: Array.from(Array(10).keys()).map(id => `u${id}`)
  }));
});

server.listen(3000);

import Koa from "koa";
import Router from "koa-router"
import redis from "redis";
import helmet from "koa-helmet";
import koaLogger from "koa-logger";

import { init as initDb, insert, lookup } from "./db";
import { getHash } from "./hash";
import { formatUrl } from "./url";
import log from "./log";

const app = new Koa();
const router = new Router();
const PORT = process.env.SHORTURL_PORT || 3000;

log.info("\tMain:\tInitializing external stuff");
Promise.all([
  initDb(redis)
]).catch(err => {
  log.error(`	Main:\tFailed to initialize application:\n${err}\n${err.stack}`);
});

log.info("\tMain:\tInitializing routes");
router.get(
  "addLink", "/",
  async (ctx, next) => {
    log.debug("Main:\tReceived request to add URL");
    const { request: { query: { u } }, state } = ctx;
    let url;

    try {
      log.debug(`Main:\tTrying to get formatted URL for ${u}`);
      url = await formatUrl(u);
    }
    catch (e) {
      log.debug(`Main:\tURL ${url} is invalid`);
      ctx.throw(400, "Invalid URL");
    }

    state.url = url;

    log.debug(`Main:\tPassing to next middleware`);
    await next();
  },
  async ({ state }, next) => {
    const { url } = state;

    log.debug(`Main:\tGetting hash for URL ${url}`);
    state.hash = await getHash(url);
    log.debug(`Main:\tGot hash ${state.hash}`);

    await next();
  },
  async (ctx) => {
    const { state: { hash, url } } = ctx;
    ctx.body = ctx.origin + ctx.path + await insert(hash, url);
    log.debug(`Main:\tResponding with: ${ctx.body}`);
  }
);

router.get(
  "getLink", "/:id",
  async (ctx, next) => {
    log.debug("Main:\tReceived request to get URL");

    const { params: { id } } = ctx;

    log.debug(`Main:\tLooking up URL at id ${id}`);
    const url = await lookup(id);
    log.debug(`Main:\tGot back URL: ${url}`);

    ctx.assert(url, 404, "No URL found");
    ctx.state.url = url;

    await next();
  },
  async (ctx) => {
    const { state: { url } } = ctx;

    log.debug(`Main:\tRedirecting to URL ${url}`);
    ctx.response.status = 302;
    ctx.redirect(url);
  }
);

log.info("\tMain:\tAdding middleware.......");
app.use(koaLogger());
app.use(helmet());
app.use(router.routes());

app.listen(PORT);
log.info(`	Main:\tListening on port ${PORT}`);

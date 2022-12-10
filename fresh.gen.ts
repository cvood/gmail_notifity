// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[name].tsx";
import * as $1 from "./routes/about.tsx";
import * as $2 from "./routes/api/_middleware.ts";
import * as $3 from "./routes/api/callback.ts";
import * as $4 from "./routes/api/dealmessage.ts";
import * as $5 from "./routes/api/fc2processer.ts";
import * as $6 from "./routes/api/joke.ts";
import * as $7 from "./routes/api/login.ts";
import * as $8 from "./routes/api/watch.ts";
import * as $9 from "./routes/api/webhock.ts";
import * as $10 from "./routes/greet/[name].tsx";
import * as $11 from "./routes/index.tsx";
import * as $$0 from "./islands/Counter.tsx";

const manifest = {
  routes: {
    "./routes/[name].tsx": $0,
    "./routes/about.tsx": $1,
    "./routes/api/_middleware.ts": $2,
    "./routes/api/callback.ts": $3,
    "./routes/api/dealmessage.ts": $4,
    "./routes/api/fc2processer.ts": $5,
    "./routes/api/joke.ts": $6,
    "./routes/api/login.ts": $7,
    "./routes/api/watch.ts": $8,
    "./routes/api/webhock.ts": $9,
    "./routes/greet/[name].tsx": $10,
    "./routes/index.tsx": $11,
  },
  islands: {
    "./islands/Counter.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;

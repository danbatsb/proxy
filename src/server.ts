import dotenv from "dotenv";
import express from "express";

import httpProxy from 'http-proxy'
import https from "https";

import {
  handleProxyError,
  handleProxyRequest,
  handleProxyResponse,
} from "./controllers/proxy";

import * as routes from "./routes";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

// create the proxy
const proxy = httpProxy.createProxyServer({
  agent: https.globalAgent,
  changeOrigin: true,
  cookieDomainRewrite: "",
  headers: {
    host: process.env.HOST,
    origin: process.env.ORIGIN
  },
  preserveHeaderKeyCase: true,
  secure: false,
  target: process.env.TARGET,
})

// Hook up proxy event handlers
proxy.on("error", handleProxyError);
proxy.on("proxyReq", handleProxyRequest);
proxy.on("proxyRes", handleProxyResponse);


// Create express app
const app = express();

const startApp = () => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
      process.env.ALLOWED_ORIGINS
    ); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.all(process.env.ALL_ROUTES, (req, res) => {
    proxy.web(req, res);
  })

  routes.register(app);

  app.listen(3003, () => console.log("Example app listening on port 3003!"));
};

startApp();

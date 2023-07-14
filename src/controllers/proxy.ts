import { ClientRequest, IncomingMessage, ServerResponse } from "http"

let cookiesStuff: string[]

/**
 *
 * @param proxyRes
 * @param req
 * @param res
 */
export function handleProxyResponse(
  proxyRes: IncomingMessage,
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
    proxyRes.headers["Access-Control-Allow-Origin"] = req.headers.origin
  }

  res.setHeader("access-control-allow-credentials", "true")

  if (proxyRes.headers["set-cookie"]) {
    const cookies = proxyRes.headers["set-cookie"].map((cookie) =>
      cookie.replace(/; secure/gi, "")
    )
    proxyRes.headers["set-cookie"] = cookies
    cookiesStuff = cookies
  }
}

/**
 *
 * @param proxyReq
 * @param req
 * @param res
 */
export function handleProxyRequest(
  proxyReq: ClientRequest,
  req: IncomingMessage,
  res: ServerResponse
) {
  proxyReq.setHeader("Access-Control-Allow-Origin", "*")

  if (cookiesStuff) {
    proxyReq.setHeader("cookie", cookiesStuff)
  }
}

/**
 *
 * @param err - The error object.
 * @param req - The incoming message.
 * @param res - The server response.
 */
export function handleProxyError(
  err: Error,
  req: IncomingMessage,
  res: ServerResponse
) {
  res.writeHead(500, {
    "Content-Type": "text/plain",
  })

  res.end("Something went wrong. And we are reporting a custom error message.")
}

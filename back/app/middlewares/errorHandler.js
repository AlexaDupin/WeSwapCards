// Centralized error handling for the API. Mounted after the router so every
// error routed through `next(err)` (including from controllerHandler and the
// authorization middlewares) lands here and produces a JSON response — never a
// redirect, never a raw Error leaked to the client.

// JSON 404 for unmatched /api routes.
const notFoundHandler = (_req, res) => {
  res.status(404).json({ error: 'Not found' });
};

// 4-arity Express error handler.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // If headers already went out, defer to Express' default handler.
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const clerkCtx = err.clerk ? ` clerk=${JSON.stringify(err.clerk)}` : '';

  if (status >= 500) {
    console.error(
      `[error] ${req.method} ${req.originalUrl} -> ${status}${clerkCtx}`,
      err.stack || err,
    );
  } else {
    console.warn(
      `[error] ${req.method} ${req.originalUrl} -> ${status}: ${err.message}`,
    );
  }

  // Don't leak internal error details to clients on 5xx in production. The full
  // message + stack is always in the server logs above.
  const isProduction = process.env.NODE_ENV === 'production';
  const message =
    status >= 500 && isProduction ? 'Internal server error' : err.message;

  res.status(status).json({ error: message });
};

module.exports = { notFoundHandler, errorHandler };

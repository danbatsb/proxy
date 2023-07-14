import { Application } from 'express';

export const register = (app: Application) => {
  // define a route handler for the default home page
  app.get('/', (req: any, res) => {
    const user = req.userContext ? req.userContext.userinfo : null
    res.render('index', { isAuthenticated: req.isAuthenticated(), user })
  })
}

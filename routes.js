

let router = new require('express').Router();
let path = require('path');

let Social = require('./index.js');


let log;

function setupRoutes(App){

  log = App.log.child({module:'socialRoute'});

  log.debug("Setup routes social");


  router.use(function(req, res, next){
    req._ctx['service']  = "social";
    req._ctx['resource']  = req.query.service;
    next();
  });


  router.post("/post",function(req, res, next){
    var ctx = req._ctx;
    let service = ctx.resource;
    let token = ctx.payload.token;
    let tokenSecret = ctx.payload.tokenSecret;
    let data = ctx.payload.data;

    ctx.model = "social";
    ctx.method = 'post';

    Social.forService(service, token, tokenSecret)
      .then(client => client.post(data))
      .then(resp => res.status(200).json(resp))
      .catch(next);

  });

  App.app.use(`${App.baseRoute}/srv/social`, router);
}


module.exports = setupRoutes;
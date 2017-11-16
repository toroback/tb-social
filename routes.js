

let router = new require('express').Router();
let path = require('path');

let Social = require('./index.js');


let log;

/**
 * @module tb-social/routes
 */
function setupRoutes(App){

  log = App.log.child({module:'socialRoute'});

  log.debug("Setup routes social");


  router.use(function(req, res, next){
    req._ctx['service']  = "social";
    req._ctx['resource']  = req.query.service;
    next();
  });



  /**
   * Realiza una publicación en una red social
   *
   * @name Publicar en red social
   *
   * @route  {POST} srv/social/post
   * 
   * @queryparam {String} service  Servicio de social (valores: facebook, twitter, gplus, linkedin) 
   * 
   * @bodyparam  {String}   token          El access token del usuario
   * @bodyparam  {String}   [tokenSecret]  (Sólo para twitter) Access Token Secret del token del usuario.
   * @bodyparam  {Object}   data           Objeto con la información que se va a publicar.
   * @bodyparam  {String}   data.message   Mensaje que se quiere publicar
   * @bodyparam  {String}   [data.link]    Link que se incluirá en la publicación
   * 
   * @return {Object}  Informacion del post realizado
   * 
   */
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
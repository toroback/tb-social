

let router = new require('express').Router();
let path = require('path');

let multer = require('multer');
// let path = require('path');
var appDir = path.dirname(require.main.filename);
let upload = multer({dest:appDir+'/../uploads'});

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
   * Realiza una publicación en una red social. 
   *
   * Si se publicará un archivo, la petición debe tener content-type multipart/form-data. 
   *
   * @name Publicar en red social
   *
   * @route  {POST} srv/social/post
   * 
   * @queryparam {String} service  Servicio de social (valores: facebook, twitter, gplus, linkedin) 
   *
   * @bodyparam  {File}  fileUpload  El archivo que se va a subir (sólo multipart).
   * 
   * @bodyparam  {String}   token               El access token del usuario
   * @bodyparam  {String}   [tokenSecret]       (Sólo para twitter) Access Token Secret del token del usuario.
   * @bodyparam  {Object}   data                Objeto con la información que se va a publicar.
   * @bodyparam  {String}   data.message        Mensaje que se quiere publicar
   * @bodyparam  {String}   [data.link]         Link que se incluirá en la publicación, para Vimeo, un enlace a ún video a publicar
   * @bodyparam  {String}   [data.title]        Título que se incluirá en la publicación (Vimeo)
   * @bodyparam  {String}   [data.description]  Descripción que se incluirá en la publicación (Vimeo)
   * @bodyparam  {Boolean}   [data.private]      Indica si la publicación será privada o no (Vimeo)
   * 
   * @return {Object}  Informacion del post realizado
   * 
   */
  router.post("/post", upload.single('fileUpload') ,function(req, res, next){
    var ctx = req._ctx;
    let service = ctx.resource;
    let body = req.body;
    console.log('original req:', req );
    console.log('original body:', body );
    
    body = normalizeObject(body);
    //Si es un post de un archivo, se mete en data para procesarlo en el servicio
    if(req.file){
      body.data.file = req.file;
    }
  
    console.log('parsed body:', body);
    let token = body.token;
    let tokenSecret = body.tokenSecret;
    let data = body.data;

    ctx.model = "social";
    ctx.method = 'post';

    Social.forService(service, token, tokenSecret)
      .then(client => client.post(data))
      .then(resp => res.status(200).json(resp))
      .catch(next);

  });

  App.app.use(`${App.baseRoute}/srv/social`, router);
}


function normalizeObject(object){  
  var normalized = Object.assign({}, object);
  Object.keys(normalized).forEach( key => {
    let value = normalized[key];
    if(typeof value === 'string'){
      if(value == 'true' || value == 'false'){
        normalized[key] = value == 'true';
      }
    }

    console.log("processing key", key);
    if(key.includes('.')){
      let index = key.indexOf('.');

      let newKey = key.substring(0, index);
      let subkey = key.substring(index+1, key.length);

      if(normalized[newKey] == undefined){
        normalized[newKey] = {};
      }

      if(typeof normalized[newKey] === 'object'){
        normalized[newKey][subkey] = normalized[key];
        delete normalized[key];
      }
    }
  });
  return normalized;
}

module.exports = setupRoutes;
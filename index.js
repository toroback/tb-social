/*
 * The Client class provides a unified social client. It
 * supports post, get and delete
 *
 * ```js
 * var Client = require('tb-social');
 * var Adapter = require('tb-social-facebook');
 * var client = new Client({
 *   appId        : '8922313712',
 *   appSecret    : '81726233218',
 *   accessToken  : '8723312638172',
 *   accessSecret : '81263128746318',
 *   timeout      : 20000
 * }, Adapter);
 * ```
 * ->Twitter
 *   consumerKey       : '2werfbDDtkN6Yp7sHCFmbLL',
 *   consumerSecret    : 'E1X8y7eGrNMwefgvywe6FYgnQm0c6kib2o8JtU6RJ5FwRD2J',
 *   accessToken       : '16236494-TqPUOve38SnYSvderegergP6nsRD6zOpghTR11S8TTC',
 *   accessTokenSecret : 'Ccdwfnhg8UhYuutWvUD34gdfdfgg9smT9mf5j',
 * ->Linkedin
 *   clientId       : '775wefwfqcy7',
 *   clientSecret   : 'NV24gdfghGmjBGH',
 *   accessToken    : 'AQXAi98EVoOverrergzOd2fgdNrX34qIHSeLAjtHCZgAWlV2inhf5_ETCw_fdV7oergergWqLTFiot8CfyAxs8RKzn5'
 * 
 */


/** 
 * @module tb-social
 *
 * @description 
 *
 * Modulo de Social
 * <p>
 * Esta módulo permite realizar publicaciones en distintas redes sociales como Facebook, Twitter, Google Plus y LinkedIn
 * 
 * Módulos relacionados con tb-social:
 * <ul>
 * <li> tb-social-facebook </li>
 * <li> tb-social-twitter </li>
 * <li> tb-social-gplus </li>
 * <li> tb-social-linkedin </li>
 * </ul>
 * <p>
 * 
 * @see [Guía de uso]{@tutorial tb-social} para más información.
 * @see [REST API]{@link module:tb-social/routes} (API externo).
 * @see [Class API]{@link module:tb-social.Client} (API interno).
 * @see Repositorio en {@link https://github.com/toroback/tb-social|GitHub}.
 * </p>
 *
 */


let App;
let log;

/**
 * Clase que representa un gestor de redes sociales
 * @memberOf module:tb-social
 */
class Client {

  /**
   * Crea un gestor de redes sociales. Utilizar los modulos tb-social-facebook, tb-social-twitter, etc…
   * @param  {Object} options        Objeto con las credenciales requeridas por el servicio. 
   * @param  {Object} Adapter        Adapter del servicio que se va a utilizar. 
   */
  constructor(options, Adapter) {
    this.options = options || {};
    this.adapter = new Adapter(this);
  }

  /**
   * Publica en la página del usuario post sencillo con mensaje y url
   * @param  {Object} options Opciones del post
   * @param  {String} options.message Mensaje que se va a publicar
   * @param  {String} [options.link] Link que se incluirá en la publicación
   * @return {Mixed} Respuesta que varía según el servicio
   */
  post(options) {
    return this.adapter.post(options);
  }

  /**
   * Obtiene los amigos para el usuario indicado si el servicio dispone de dicha funcionalidad
   * @param  {String} userId Id del usuario en el servicio
   * @return {Promise<Object>} Promesa con el resultado
   */
  peopleGet(userId){
    return this.adapter.peopleGet(userId);
  }
  
  /**
   * Setup del módulo. Debe ser llamado antes de crear una instancia
   * @param {Object} _app Objeto App del servidor
   * @return {Promise} Una promesa
   */
  static setup(app){
    return new Promise((resolve,reject)=>{
      App = app;
      log = App.log.child({module:'social'});

      log.debug("iniciando Módulo social");

      require("./routes")(app);
    
      resolve();

    });
  }

  /**
   * Obtiene un gestor de redes sociales ya configurado para un servicio indicado tomando la configuración del archivo de configuración del servidor(config.json).
   * @param  {String} service      El servicio para el que se quiere crear el gestor
   * @param  {String} accessToken  Access token del servicio 
   * @param  {String} accessSecret Access Secret del servicio
   * @return {Promise<Object>} Una promesa con el gestor
   */
  static forService(service, accessToken, accessSecret){
    return new Promise((resolve, reject) => {

      if (!App)
        throw new Error('setup() needs to be called first');
      let credentials
      let options;
      let adapter;
      let client;
      if(service){
        switch (service) {
          case "facebook":
            credentials = App.socialOptions.facebook;
            if(!credentials || !credentials.appSecret || !credentials.appId)
               throw new Error('facebook options must be configured');

            adapter = require('tb-social-facebook');
            options = {
              appId      : credentials.appId, 
              appSecret  : credentials.appSecret,
              accessToken: accessToken,
              timeout    : 2 * 1000 
            }
        
            break;
          case "twitter":
           credentials = App.socialOptions.twitter;
            if(!credentials || !credentials.consumerSecret || !credentials.consumerKey)
               throw new Error('twitter options must be configured');

            adapter = require('tb-social-twitter');
            options = {
              consumerKey         : credentials.consumerKey, 
              consumerSecret      : credentials.consumerSecret,
              accessToken         : accessToken,
              accessTokenSecret   : accessSecret,
              timeout             : 60*1000
            }
            break;
          case "gplus":
            credentials = App.socialOptions.gplus;
            if(!credentials || !credentials.clientSecret || !credentials.clientId)
               throw new Error('gplus options must be configured');

            adapter = require('tb-social-googleplus');
            options = {
              clientId      : credentials.clientId, 
              clientSecret  : credentials.clientSecret,
              accessToken   : accessToken,
              idToken       : accessSecret
            }
            break;
          case "linkedin":
           credentials = App.socialOptions.linkedin;
            if(!credentials || !credentials.clientSecret || !credentials.clientId)
               throw new Error('linkedin options must be configured');

            adapter = require('tb-social-linkedin');
            options = {
              clientId      : credentials.clientId, 
              clientSecret  : credentials.clientSecret,
              accessToken   : accessToken
            }
            break;
        }
      }
      if(options && adapter){
        client = new Client(options,adapter);
      }

      if(client){
        resolve(client);
      }else{
        reject(new Error('Service does not exist'));
      }
    });
  }

}


module.exports = Client;

/**
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
 * @class
 */

let App;
let log;

class Client {
  constructor(options, Adapter) {
    this.options = options || {};
    this.adapter = new Adapter(this);
  }
  /**
   * Publica en la página del usuario post sencillo con mensaje y url
   * @param  {Mixed} options {message:"mensaje", link:"http://www.jah.com"}
   * @return {Mixed} Respuesta que varía según el servicio
   */
  post(options) {
    return this.adapter.post(options);
  }

  peopleGet(userId){
    return this.adapter.peopleGet(userId);
  }
  
  static setup(app){
    return new Promise((resolve,reject)=>{
      App = app;
      log = App.log.child({module:'social'});

      log.debug("iniciando Módulo social");

      require("./routes")(app);
    
      resolve();

    });
  }

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

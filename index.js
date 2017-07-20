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
  
}


module.exports = Client;
# tb-social

Esta módulo permite realizar acciones sobre distintas redes sociales como Facebook, Twitter, Google Plus y LinkedIn

Para utilizar los distintos servicios primero es necesario instalar su respectivo módulo y luego configurar las credenciales en la aplicación.

Módulos de servicios:
  
- tb-social-facebook
- tb-social-twitter
- tb-social-gplus
- tb-social-linkedin

## Configuración:
  
  La configuración de cualquier servicio se realizar en el archivo config.json que se encuentra en la carpeta "app". Para ellos hay que incluir y modificar un objeto llamado *"socialOptions"* y agregar un objeto interno para cada servicio que se utilizará que contendrá las credenciales. La clave de cada objeto será especial para cada servicio usando las siguientes claves para cada servicio:

  - Facebook -> "fb"
  - Twitter -> "tw"
  - Google+ -> "gplus"
  - LinkedIn -> "linkedin"

  La información que contendrá cada objeto es la siguiente:

  - "clientId"  : Id de la aplicación registsrada en el servicio.
  - "secretKey" : Clave secreta de la aplicación registsrada en el servicio.

  Un ejemplo de configuración de facebook y twitter sería el siguiente:

  ```
  ...
  "socialOptions": {
    "fb": {
      "clientId": myFacebookClientId,
      "secretKey": myFacebookSecretKey
    },
    "tw": {
      "clientId": myTwitterClientId,
      "secretKey": myTwitterSecretKey
    }
  }
  ...
  ```


## Ejemplos:

  Para hacer una publicacion a través de una red social es necesario hacer un post a:

    "https://[domain]:[port]/api/v[apiVersion]/srv/social/post?service=< service>"

    Donde service es la red social en la que se quiera hacer la publicación. Los posible valores que puede tomar son:

    + facebook
    + twitter
    + gplus
    + linkedin  

  Como información del post hay que mandar la siguiente informacion:

    + token: El access token del usuario
    + tokenSecret : (Sólo para twitter) Access Token Secret del token del usuario.
    + data: Objeto con la información que se va a publicar.
    + data.message : Mensaje que se quiere publicar
    + data.link : Link que se incluirá en la publicación

  - Ejemplo de publicacion en twitter:

    POST: http://localhost:4524/api/v1/srv/social/post?service=twitter
    DATOS: 

    ```
    {
      "token":"1xxxx377xx-OI3dlxxxxyI3tRzvczGxxxZtcyCxsvo8qxxxxli",
      "tokenSecret":"oS9xxxxNUxxxJ3ryY3xUl270xxxSwgBcekzRjvmhxxxD5",
      "data":
        {
          "message":"Test post",
          "link":"https://www.google.com"
        }
    }
    ```

# tb-social

Esta módulo permite realizar acciones sobre distintas redes sociales como Facebook, Twitter, Google Plus y LinkedIn

Para utilizar los distintos servicios primero es necesario instalar su respectivo módulo y luego configurar las credenciales en la aplicación.

Módulos de servicios:
  
- tb-social-facebook
- tb-social-twitter
- tb-social-gplus
- tb-social-linkedin

## **Configuración**
  
#### **Desde la interfaz de administración A2Server:**
En la aplicación seleccionada acceder a la sección "Configuración" y luego a la pestaña "Social".

Una vez en la pestaña se pueden observar las secciones para completar los distintos servicios.

Cada servicio requeire distintos campos que rellenar:

- Facebook:
  - Application ID
  - Application Secret

- Twitter:
  - Consumer Key
  - Consumer Secret

- LinkedIn:
  - Client ID
  - Client Secret

- Google Plus:
  - Client ID
  - Client Secret

#### **Configuracion manual:**
La configuración de cualquier servicio se realizar en el archivo config.json que se encuentra en la carpeta "app". Para ellos hay que incluir y modificar un objeto llamado *"socialOptions"* y agregar un objeto interno para cada servicio que se utilizará que contendrá las credenciales. La clave de cada objeto será especial para cada servicio usando las siguientes claves para cada servicio:

- Facebook -> "fb"
- Twitter -> "tw"
- Google+ -> "gplus"
- LinkedIn -> "linkedin"

La información que contendrá cada objeto es la siguiente:

- "clientId"  : Id de la aplicación registsrada en el servicio.
- "secretKey" : Clave secreta de la aplicación registsrada en el servicio.

Un ejemplo de configuración de facebook y twitter sería el siguiente:

```javascript
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

## **Modo de uso**

Los servicios se pueden utilizar de dos maneras:

- Mediante llamadas internas al modelo (Servidor):

  Utilizando las funcinoes de ***App.Push***

  - Ejemplo:
    ```javascript
    var service = "facebook"; // Servicio
    var accessToken = "…";
    var tokenSecret = "…";
    var Social = App.Social.forService(service)
      .then(client => {…})
      .catch(err => {…});
    ```

- Mediante REST Api (Servidor o cliente):

  Realizando peticiones a los servicios de social con el siguiente formato de URL

  - `https://[domain]:[port]/api/v[apiVersion]/srv/social/`
  
## **Funcionalidades**
A continuación se detallarán las funcionalidades de las que dispone el módulo.

### **Hacer una publicación:**

- **Petición REST:**

  - HTTP Method: 

    POST
    
  - URL: 

    `https://[domain]:[port]/api/v[apiVersion]/srv/social/post?service=<service>`

  - Parámetros del query:

    | Clave | Tipo | Opcional   | Descripción  |
    |---|---|:---:|---|
    | service  |  String  |   | Servicio de social (valores: facebook, twitter, gplus, linkedin)  |

  - Parámetros Body: 

    | Clave | Tipo | Opcional   | Descripción  |
    |---|---|:---:|---|
    | token  |  String  |   | El access token del usuario  |
    | tokenSecret  |  String  | X | (Sólo para twitter) Access Token Secret del token del usuario.  |
    | data  |  Object  |   | Objeto con la información que se va a publicar.  |
    | data.message  |  String  |   | Mensaje que se quiere publicar |
    | data.link   |  String  | X |  Link que se incluirá en la publicación  |

  - Respuesta:

    Actualmente la respuesta varía en función del servicio por el que se realiza la publicación.

  - Ejemplo: 

    - Petición:

     ```
      POST:  http://a2server.a2system.net:1234/api/v1/srv/social/post?service=twitter
     ```
     
      - Body:

        ```javascript
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

-  **Código Javascript:**
  
  En primer lugar hay que obtener un objeto para realizar utilizar el servicio como se explica en la sección "Modo de uso" y luego realizar la publicación.

  - Para obtener cliente del servicio: 

    | Clave | Tipo | Opcional   | Descripción  |
    |---|---|:---:|---|
    | service  |  String  |   | Servicio de social (valores: facebook, twitter, gplus, linkedin)  |
    | token  |  String  |   | El access token del usuario  |
    | tokenSecret  |  String  | X | (Sólo para twitter) Access Token Secret del token del usuario.  |

  - Información de la publicación:

    | Clave | Tipo | Opcional   | Descripción  |
    |---|---|:---:|---|
    | data  |  Object  |   | Objeto con la información que se va a publicar.  |
    | data.message  |  String  |   | Mensaje que se quiere publicar |
    | data.link   |  String  | X |  Link que se incluirá en la publicación  |

  - Ejemplo:
    ```javascript
      var service = "facebook"; // Servicio
      var accessToken = "…";
      var tokenSecret = "…";
      var data = {
        "message": "Hello world!"
      }
      var Social = App.Social.forService(service)
        .then(client => {
          client.post(data)
        })
        .then(res => {…})
        .catch(err => {…});
    ```
    

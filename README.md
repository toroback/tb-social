# tb-social

Esta módulo permite realizar acciones sobre distintas redes sociales como **Facebook**, **Twitter**, **Google Plus** y **LinkedIn**

Para utilizar los distintos servicios primero es necesario instalar su respectivo módulo y luego configurar las credenciales en la aplicación.

Módulos de servicios:
  
- tb-social-facebook
- tb-social-twitter
- tb-social-gplus
- tb-social-linkedin

## **Configuración**
  
### **- Desde la interfaz de administración A2Server:**

En la aplicación seleccionada acceder a la sección "Configuración" y luego a la pestaña "Social".

Una vez en la pestaña se pueden observar las secciones para completar los distintos servicios.

Cada servicio requeire distintos campos que rellenar:

- **Facebook:**
  + Application ID
  + Application Secret


- **Twitter:**
  + Consumer Key
  + Consumer Secret


- **LinkedIn:**
  + Client ID
  + Client Secret


- **Google Plus:**
  + Client ID
  + Client Secret


- **Vimeo:**
  + Client Id
  + Client Secret
  + Access token (Opcional)


- **Flickr:**
  + Client Key
  + Client Secret
  + Access token (Opcional)
  + Access Secret (Opcional)


### **- Configuracion manual:**

La configuración de cualquier servicio se realizar en el archivo _**config.json**_ que se encuentra en la carpeta  _**app**_. Para ellos hay que incluir y modificar un objeto llamado _**socialOptions**_ y agregar un objeto interno para cada servicio que se utilizará que contendrá las credenciales. La clave de cada objeto será especial para cada servicio usando las siguientes claves para cada servicio:
- Facebook -> _**facebook**_
- Twitter  -> _**twitter**_
- Google+  -> _**gplus**_
- LinkedIn -> _**linkedin**_
- Vimeo -> _**vimeo**_
- Flickr -> _**flickr**_

La información que contendrá cada objeto depende del servicio, pero en general todos necesitan:
- Un identificador de la aplicación registsrada en el servicio.
- Una clave secreta de la aplicación registsrada en el servicio.

El nombre para cada uno de dichos campos para cada servicio, se muestra junto con un ejemplo a continuación:
```javascript
...
"socialOptions": {
  "facebook": {
    "appId": myFacebookClientId,
    "appSecret": myFacebookSecretKey
  },
  "twitter": {
    "consumerKey": myTwitterClientId,
    "consumerSecret": myTwitterSecretKey
  },
  "gplus": {
    "clientId": myGPlusClientId,
    "clientSecret": myGPlusSecretKey
  },
  "linkedin": {
    "clientId": myLinkedInClientId,
    "clientSecret": myLinkedInSecretKey
  },
 "vimeo":{
    "clientId": "myVimeoClientId",
    "clientSecret": "myVimeoClientSecret",
    "accessToken": "myVimeoDefaultAccessToken"
  },
  "flickr":{
    "clientKey": "myFlickrClientKey",
    "clientSecret": "myFlickrClientSecret",
    "accessToken": "myFlickrDefaultAccessToken",
    "accessSecret": "myFlickrDefaultAccessSecret"
  }
}
...
```

## **Modo de uso**

Los servicios se pueden utilizar de dos maneras:

### **- Mediante llamadas internas al modelo (Servidor):**

Las llamadas internas se realizan utilizando las funciones del módulo _**social**_ accediendo a él a través del objeto global _**App**_ como en el siguiente ejemplo.

```js
var service = "facebook"; // Servicio
var accessToken = "…";
var tokenSecret = "…";
var Social = App.social.forService(service, accessToken, tokenSecret)
  .then(client => {…})
  .catch(err => {…});
```

### **- Mediante REST Api (Servidor o cliente):**

Realizando peticiones a los servicios de social con el siguiente formato de URL:

`https://[domain]:[port]/api/v[apiVersion]/srv/social/`
  
## **Funcionalidades**

A continuación se detallarán las funcionalidades de las que dispone el módulo.

### **- Hacer una publicación / Subir un archivo:**

#### **• REST Api:**

**Petición:**

|HTTP Method|URL|
|:---:|:---|
|POST / POST Multipart| `https://[domain]:[port]/api/v[apiVersion]/srv/social/post?service=<service>` |


**Parámetros del query:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
| service  |  String  |   | Servicio de social (valores: facebook, twitter, gplus, linkedin)  |


**Parámetros Body:** 

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
| fileUpload  |  File  | X | (Sólo para POST Multipart) El archivo que se va a subir  |
| token  |  String  |   | El access token del usuario  |
| tokenSecret  |  String  | X | (Sólo para twitter) Access Token Secret del token del usuario.  |
| data  |  Object  |   | Objeto con la información que se va a publicar.  |
| data.message  |  String  |   | Mensaje que se quiere publicar |
| data.link   |  String  | X |  Link que se incluirá en la publicación  |
| data.title   |  String  | X |  Título que se incluirá en la publicación de archivos  |
| data.description   |  String  | X |  Descripción que se incluirá en la publicación de archivos  |
| data.private   |  Boolean  | X |  Indica si la publicación será privada o no (Vimeo, Flickr)  |


**Respuesta:**

Actualmente la respuesta varía en función del servicio por el que se realiza la publicación.


**Ejemplo Publicacíon Twitter:**

* Petición:
```
 POST:  http://a2server.a2system.net:1234/api/v1/srv/social/post?service=twitter
```

* Body:
```js
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

 **Ejemplo Subida de archivo Vimeo (Multipart):**

* Petición:
```
 POST Multipart:  http://a2server.a2system.net:1234/api/v1/srv/social/post?service=vimeo
```

* Parámetros Multipart:
```js
 "fileUpload": <archivo a subir> 
 "token":"userVimeoToken"
 "data.title": "My video title"
 "data.description": "My video description"
 "data.private": "true"
```

 **Ejemplo Publicación desde link Vimeo:**

* Petición:
```
 POST Multipart:  http://a2server.a2system.net:1234/api/v1/srv/social/post?service=vimeo
```

ó

```
 POST:  http://a2server.a2system.net:1234/api/v1/srv/social/post?service=vimeo
```


* Parámetros Multipart:
```js
 "link": <link a video a subir> 
 "token":"userVimeoToken"
 "data.title": "My video title"
 "data.description": "My video description"
 "data.private": "true"
```

ó

```js
{
  "token":"userVimeoToken",
  "data":
    {
      "title":"My video title",
      "description": "My video description",
      "link":"https://www.google.com"
      "private": true
    }
 } 
 ```

#### **• Código Javascript:**  
En primer lugar hay que obtener un objeto para realizar utilizar el servicio como se explica en la sección "Modo de uso" y luego realizar la publicación.


##### **- Información para obtener cliente del servicio:** 

|Clave|Tipo|Opcional|Descripción|
|---|---|:---:|---|
|service|String|  |Servicio de social (valores: facebook, twitter, gplus, linkedin)|
|token|String|  |El access token del usuario|
|tokenSecret|String| X |(Sólo para twitter) Access Token Secret del token del usuario.|


##### **- Información para la publicación:**

|Clave|Tipo|Opcional|Descripción|
|---|---|:---:|---|
|data|Object| |Objeto con la información que se va a publicar.|
|data.message|String| |Mensaje que se quiere publicar|
|data.link|String| X |Link que se incluirá en la publicación|
| data.title   |  String  | X |  Título que se incluirá en la publicación de archivos  |
| data.description   |  String  | X |  Descripción que se incluirá en la publicación de archivos  |
| data.private   |  Boolean  | X |  Indica si la publicación será privada o no (Vimeo, Flickr)  |
| data.file   |  File  | X |  Archivo que se va a subir (Vimeo, Flickr)  |

##### **- Ejemplo:**

```js
  var service = "facebook"; // Servicio
  var accessToken = "…";
  var tokenSecret = "…";
  var data = {
    "message": "Hello world!"
  }
  var Social = App.social.forService(service, accessToken, tokenSecret)
    .then(client => {
      client.post(data)
    })
    .then(res => {…})
    .catch(err => {…});
```
    

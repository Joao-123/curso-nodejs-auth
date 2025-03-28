## Tienda en línea: instalación del proyecto
### ¿Cómo comenzar con el proyecto base en Node.js?
Inicia tu viaje en el desarrollo backend con Node.js partiendo de una estructura sólida. En el curso anteriormente mencionado, trabajamos en el desarrollo de un eCommerce, integrando distintas capas como controladores, conexiones a bases de datos con PostgreSQL a través de Sequelize, y estructuras para orden de compra y productos. Ahora, nos enfocamos en implementar la capa de autenticación y autorización.
### ¿Cómo clonar el proyecto y preparar el entorno?
Para facilitar el avance, clona el código base del repositorio usando la terminal:
```cmd
git clone https://github.com/platzicurso/nogs-auth.git magiestore-auth
```
Esta acción te permite descargar todo el proyecto preparado hasta el paso anterior en el curso de backend.
1. ***Instala las dependencias:*** Ejecuta **npm install** dentro de la carpeta clonada.
2. ***Configura las variables de entorno:*** Crea un archivo **.env** donde coloques datos críticos como la URL de conexión a la base de datos, el puerto y el entorno.
3. ***Prepara la base de datos:*** Antes de proceder, asegúrate de tener Docker corriendo los contenedores necesarios:

```cmd
docker-compose up -d postgres
docker-compose up -d pgadmin
```
### ¿Cómo ejecutar la migración inicial?
Las migraciones son esenciales para preparar la estructura de la base de datos. Verifica que tu contenedor de PostgreSQL esté correctamente levantado y que la carpeta de volumen (donde Docker guarda datos persistentes) esté creada.  
Corre la migración inicial ejecutando:
```cmd
npm run migrations:run
```
Este comando aplicará todos los cambios necesarios a la base de datos, creando tablas y configuraciones iniciales. En caso de error con las variables de entorno, asegúrate de que todas coincidan correctamente con las configuraciones del Docker.
### ¿Cómo gestionar ambientes con Insomnia?
Insomnia te permite realizar pruebas de la API, cambiando entre entornos (producción y desarrollo) de manera sencilla.
1. Crea ambientes: Define los ambientes mediante variables que se pueden configurar en Insomnia.
2. Configura las URLs del API: Inserta URLs según el ambiente correspondiente:
  - Producción puede ser https://api.miapp.com.
  - Desarrollo configúralo como http://localhost:3000.
3. Selecciona el ambiente actual: Cambia entre dev y prod según necesites, asegurando que estás apuntando al servidor correcto.

### Beneficios de esta configuración
- ***Flexibilidad:*** Permite modificar configuraciones sin necesidad de cambiar cada endpoint manualmente.
- ***Seguridad:*** Antes de realizar cambios a producción, puedes asegurarte de que todo funcione correctamente en desarrollo.
### ¿Qué hacer ahora?
Con el proyecto corriendo y la API lista para el manejo de peticiones, el próximo paso es implementar una capa de autenticación. Empezaremos creando un middleware para verificar la API key y asegurar que las solicitudes solo sean procesadas si son legítimas.  
Este proceso no solo resguardará la aplicación, sino que sienta las bases para el control de acceso a tu API. ¡Adelante, y sigue explorando el potencial del desarrollo backend con Node.js!

## Middleware de verificación
### ¿Cómo crear un middleware para autenticación y autorización?
Crear un middleware en nuestras aplicaciones es esencial para garantizar la autenticación y autorización correcta de los usuarios. Nos permite validar las solicitudes antes de pasar a la siguiente capa o endpoint de los servicios. Aquí, exploraremos la creación de un middleware que verifique una clave API (API key) desde los headers de la solicitud y discutiremos su importancia en las comunicaciones máquina a máquina.
### ¿Cuál es la función de un middleware en autenticación?
Un middleware es un punto de conexión que maneja cierta lógica antes de que una solicitud llegue a su destino final en el servidor. En el contexto de autenticación:
- ***Verificación de API key:*** El middleware verifica que una API key proporcionada en los headers coincida con una clave predefinida o almacenada en una variable de ambiente.
- ***Progreso mediante `next`:*** Si la clave es correcta, el flujo pasa al siguiente middleware o servicio.
- ***Rechazo de acceso:*** Si la API key no es válida, el acceso se niega con un mensaje de falta de autorización.

Esta forma de autenticación es común, por ejemplo, al consumir servicios de Machine Learning de grandes compañías o al interactuar con APIs de terceros como la de Marvel.
### ¿Cómo configurar un middleware en Node.js?
Para implementar un middleware que verifique la API key, sigue estos pasos:
1. Crear el middleware: Define una función que revisa el valor de la API key y decide si continúa o no:
  ```js
  function checkApiKey(req, res, next) {
      const apiKey = req.headers['api'];
      if (apiKey === '123') {
          return next();
      } else {
          const error = new Error('No autorizado');
          error.status = 401;
          return next(error);
      }
  }

  module.exports = checkApiKey;
  ```
2. Integrar el middleware en la aplicación: Importa y utiliza la función en tus rutas. Por ejemplo:
```js
const express = require('express');
const checkApiKey = require('./middlewares/authHandler');
const app = express();

app.use('/nuevaRuta', checkApiKey, (req, res) => {
    res.send('Hola, soy una nueva ruta');
});
```
3. Pruebas con herramientas como Insomnia: Realiza peticiones y verifica que el middleware funciona rechazando o permitiendo la solicitud con base en la API key ingresada en los headers.

### ¿Por qué es importante la variable de ambiente?
Hardcodear valores, como la API key directamente en el código, es una mala práctica. Aquí es donde entra el uso de variables de ambiente, proporcionando flexibilidad y seguridad:
- ***Almacenamiento seguro:*** Puedes almacenar claves y configuraciones sensibles fuera del código fuente.
- ***Facilidad de configuración:*** Cambios en las configuraciones no requieren modificaciones del código ni nuevos despliegues de la aplicación.
- ***Portabilidad:*** Permite que el mismo código funcione en diferentes entornos con configuraciones específicas para cada caso.

Para mejorar nuestro middleware, lee la API key desde una variable de ambiente usando un archivo de configuración, por ejemplo:
```js
const config = require('./config');

function checkApiKey(req, res, next) {
    const apiKey = req.headers['api'];
    if (apiKey === config.API_KEY) {
        return next();
    } else {
        const error = new Error('No autorizado');
        error.status = 401;
        return next(error);
    }
}

module.exports = checkApiKey;
```
### ¿Qué sigue después de la autenticación con API key?
Con una base sólida de autenticación utilizando API keys, el siguiente paso podría ser implementar un sistema más robusto que incluya la verificación de usuarios y contraseñas. Esto puede incluir:
- ***Hashing de contraseñas***: Asegurar que las contraseñas en la base de datos no estén en texto claro.
- ***Tokens de acceso***: Generar y validar tokens que puedan ofrecer un sistema de acceso a usuarios autenticados.

El dominio de estas técnicas no solo mejora la seguridad de tus aplicaciones, sino que también abre puertas a implementar otros sistemas de autenticación como OAuth o JWT. ¡Sigue aprendiendo y experimentando para enriquecer tus habilidades en desarrollo seguro!

## Hashing de contraseñas con bcryptjs
### ¿Por qué es necesario encriptar contraseñas?
El hashing de contraseñas es una técnica indispensable cuando se trata de la seguridad de la información en aplicaciones web. No guardar las contraseñas en crudo en tu base de datos es fundamental, ya que permite minimizar riesgos de seguridad. Las contraseñas deben estar encriptadas para protegerlas, incluso de los administradores y cualquier parte del equipo que tenga acceso a la base de datos. En esta guía, aprenderás cómo implementar el hashing de contraseñas de forma eficaz utilizando la librería `bcrypt`.
### ¿Cómo funciona el hashing de contraseñas?
Para proteger las contraseñas, no basta con un simple cifrado. El hashing genera una representación única de la contraseña mediante un algoritmo específico. Esto es lo que realmente debemos almacenar en nuestras bases de datos, no la contraseña original. Pero, ¿qué sucede cuando un usuario ingresa de nuevo su contraseña? Necesitamos saber si coincide con el hash almacenado. Veamos cómo realizar todo el proceso.
### Implementando el hashing de contraseñas con `bcrypt`
#### Instalación de bcrypt
Para comenzar, es crucial contar con la librería `bcrypt` que nos permitirá realizar el hashing:
```cmd
npm install bcrypt
```
#### Creación del archivo de ejecución
Primero, crea un nuevo archivo llamado passwordHash.js y sigue los pasos a continuación.

##### Importación y uso de bcrypt
```js
const bcrypt = require('bcrypt');

async function hashPassword() {
  const myPassword = "una_contraseña_segura";
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(myPassword, saltRounds);
  
  console.log(hashedPassword);
}

hashPassword();
```
En este código:
- Definimos una contraseña a ser encriptada.
- `saltRounds` determina cuántas veces se aplica el algoritmo para fortalecer el hash.
- Usamos `bcrypt.hash()` que es una función asíncrona para obtener la contraseña encriptada y almacenarla.
##### Verificación de Contraseñas
###### Creación del archivo de verificación
Para verificar contraseñas, crea un archivo nuevo llamado passwordVerify.js.
##### Utilizando bcrypt para verificar
```js
async function verifyPassword() {
  const myPassword = "una_contraseña_segura";
  const hash = "el_hash_de_tu_contraseña"; // Reemplaza con el hash generado previamente
  
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch ? "Contraseña correcta" : "Contraseña incorrecta");
}

verifyPassword();
```
Con este código:
- Comparamos la contraseña ingresada por el usuario con el hash almacenado.
- `bcrypt.compare()` retorna `true` si coinciden, o `false` si no.
#### Recomendaciones prácticas para la implementación
- Asegúrate de nunca almacenar contraseñas en crudo.
- Incrementa la seguridad usando un número elevado de `saltRounds`, generalmente un valor de 10 es suficiente.
- Integrar estos mecanismos de seguridad en tu API es crucial para proteger a los usuarios.
- Realiza pruebas exhaustivas para garantizar que los procesos de hashing y verificación funcionan correctamente.

La correcta implementación de hashing y verificación protegerá la privacidad de tus usuarios, mientras fortalece la seguridad de tu aplicación. ¡Sigue aprendiendo y garantizando la seguridad digital!

## Implementando hashing para usuarios
### ¿Cómo se implementa el hashing de contraseñas en endpoints de usuario y cliente?
Cuando trabajamos con datos sensibles como contraseñas, es imperativo asegurarse de que sean almacenados de manera segura. En este contenido, exploraremos cómo se puede integrar el hashing de contraseñas en una API para mejorar la seguridad tanto al crear usuarios como clientes.
### ¿Qué pasos se deben seguir para hash las contraseñas al crear un usuario?
En primer lugar, es vital que las contraseñas no se almacenen en texto plano dentro de nuestra base de datos. Utilizando una librería como Bcrypt para encriptar contraseñas es una práctica común. La implementación requiere los siguientes pasos:
1. ***Importar la librería Bcrypt:*** Esto se logra añadiendo la línea de importación correspondiente en el archivo del servicio de usuarios.
2. ***Generar el hash:*** Antes de almacenar la contraseña en la base de datos, se genera un hash de la contraseña original utilizando un método provisto por Bcrypt. Aquí un ejemplo en JavaScript:
```js
const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}
```
3. Reemplazar la contraseña por el hash en el objeto usuario: Una vez generado el hash, se sustituye la contraseña original por el hash antes de almacenar el usuario en la base de datos:
```js
const newUser = {
  ...userData,
  password: hashedPassword,
};
```
4. Verificar que el password no se retorne: Asegúrate de no devolver la contraseña (ni siquiera el hash) al cliente una vez creado el usuario. Utiliza delete para eliminar el campo password:
```js
delete newUser.password;
```
### ¿Cómo se aplica el hash en el endpoint de creación de clientes?
La lógica de encriptación también se aplica cuando se están creando clientes. Estos pasos aseguran que las contraseñas relacionadas continúan utilizando hashing, manteniendo los datos seguros:
1. Clonar y modificar el objeto de datos: Al crear un cliente, clonar el objeto contenido y aplicar el hash al sub-objeto correspondiente:
```js
const cloneData = { ...data };
cloneData.user.password = await hashPassword(cloneData.user.password);
```
2. Eliminar el campo de password en la respuesta: Aplicar la misma estrategia de eliminación para que la contraseña no sea parte de la respuesta devuelta al cliente:
```js
delete cloneData.user.password;
```
### ¿Qué beneficios ofrece este enfoque?
Implementar el hashing de contraseñas ofrece varios beneficios de seguridad:
- ***Reducción de riesgo:*** Minimiza el riesgo de exposición en caso de filtraciones de datos.
- ***Cumplimiento de normativas:*** Ayuda a cumplir regulaciones de protección de datos que exigen la protección de información sensible.
- ***Confianza del usuario:*** Mejora la confianza del usuario en el manejo seguro de sus datos personales.

Al finalizar la configuración del hashing para la implementación detallada, se está listo para proceder a desarrollar funcionalidades avanzadas como endpoints de login y autenticación basados en tokens seguros. Siempre es fundamental estar un paso adelante en temas de seguridad dentro de tu API.

## Implemetando login con Passport.js
### ¿Cómo implementar la autenticación con Passport.js?
Passport.js es una herramienta valiosa para implementar capas de autenticación en aplicaciones web. Este middleware es flexible y admite múltiples estrategias de autenticación, como login con usuario y contraseña o a través de plataformas sociales como Facebook y Twitter. Además, Passport.js facilita la integración de nuevas estrategias sin modificar la estructura de nuestro código base.
### ¿Cómo instalar Passport.js y las estrategias de autenticación?
Antes de comenzar a crear estrategias, es esencial instalar las dependencias necesarias en nuestro proyecto. En la terminal, ejecutamos los siguientes comandos para instalar Passport.js y su estrategia local:
```cmd
npm install passport
npm install passport-local
```
Estas instalaciones permitirán gestionar autenticaciones básicas mediante usuario y contraseña.
### ¿Cómo organizar el proyecto para gestionar estrategias?
Una buena práctica es tener un directorio específico para las estrategias de autenticación. Esto nos ayuda a mantener nuestro proyecto ordenado y escalable. Creamos una carpeta llamada `utils`, y dentro de ella, un subdirectorio llamado `auth`, donde colocaremos nuestras estrategias.
```
utils/
└── auth/
    └── strategies/
        └── localStrategy.js
```
Aquí es donde desarrollaremos la primera estrategia de autenticación usando `passport-local`.
### ¿Cómo implementar una estrategia con Passport Local?
Para implementar nuestra estrategia local, primero debemos importar Passport y la estrategia local en nuestro `index.js` dentro de `auth`. Además, configuramos nuestra estrategia para manejar el login.
```js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  async (username, password, done) => {
    // Implementación de la lógica de autenticación
  }
));
```
Hemos definido una nueva `LocalStrategy`, pero aún debe incluir la lógica de negocio para manejar un login por usuario y contraseña. Passport nos proporciona automáticamente los parámetros `username` y `password`, así como una función `done` para manejar el resultado del proceso de autenticación.
### ¿Cómo integrar un servicio de usuarios?
Nuestra estrategia utiliza un servicio para buscar usuarios por email en la base de datos. Implementamos un método `findByEmail` en nuestro servicio de usuarios para realizar esta búsqueda:
```js
const UserService = (db) => {
  const findByEmail = async (email) => {
    // búsqueda en la base de datos
  };
  return { findByEmail };
};
```
En nuestro archivo de estrategia, necesitamos importar y usar este servicio para verificar si el usuario existe y validar su contraseña:
```js
const userService = new UserService();

passport.use(new LocalStrategy(
  async (email, password, done) => {
    try {
      const user = await userService.findByEmail(email);
      if (!user || !user.validPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
```
### ¿Cómo manejar los errores y la respuesta exitosa?
En caso de que algo salga mal, Passport utiliza la función `done` para propagar errores. Importamos `Boom` para estructurar errores HTTP y enviar respuestas adecuadas:
```js
const Boom = require('@hapi/boom');

passport.use(new LocalStrategy(
  async (email, password, done) => {
    try {
      const user = await userService.findByEmail(email);
      if (!user) {
        return done(Boom.unauthorized('Email o contraseña incorrecta'), false);
      }
      if (!user.validPassword(password)) {
        return done(Boom.unauthorized('Email o contraseña incorrecta'), false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
```
### ¿Cómo personalizar los nombres de los campos en la estrategia?
Si preferimos utilizar el campo `email` en lugar de `username`, alteramos la configuración de Passport Local antes de definir nuestra estrategia:
```js
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
    // Implementación
}));
```
### ¿Cómo integrar la estrategia en el routing?
Finalmente, conectamos nuestra estrategia con las rutas de la API. Creamos un archivo `authRouter`.js en el que importamos la estrategia y definimos nuestro endpoint:
```js
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
```
### ¿Por qué necesitamos JSON Web Tokens?
Hasta ahora, hemos logrado verificar usuarios utilizando Passport.js, pero la autenticación es solo una parte del proceso. Para mantener sesiones seguras y autorizar posteriormente acciones de usuarios, los JSON Web Tokens (JWT) son cruciales. Continuaremos con los JWT en el siguiente paso para enriquecer nuestro sistema de autenticación. ¡No te lo pierdas!

## ¿Qué es un JWT?
### ¿Qué son los JSON Web Tokens y por qué son revolucionarios en la autenticación?
La autenticación es un componente crucial en la seguridad web, y la llegada de los JSON Web Tokens (JWT) ha revolucionado cómo manejamos las sesiones y accesos entre el front-end y el back-end. A diferencia de las cookies tradicionales que dependen del almacenamiento de sesiones en el servidor, los JWT son stateless, lo que significa que no necesitas guardar información en memoria o bases de datos. Este enfoque no solo resuelve problemas comunes en sistemas distribuidos, sino que también permite una escalabilidad sin precedentes.
### ¿Cómo se manejaba la autenticación antes de los JWT?
Históricamente, la autenticación en web se gestionaba con sesiones que se almacenaban en el servidor. Aquí te dejamos un esquema sencillo de cómo se hacía:
- ***Cliente (Front-end):*** Aplicaciones en Angular, React o cualquier otro cliente que se conecta a nuestro back-end.
- ***Sesión:*** Se guardaba una sesión en cookies que se transmitían al back-end.
- ***Back-end:*** Mantenía la sesión en memoria o en la base de datos, y comprobaba la autenticidad de la sesión.

Sin embargo, este método presenta problemas cuando necesitamos escalar, especialmente si requerimos distribuir nuestra API en múltiples servidores alrededor del mundo. La sesión se vinculaba a un servidor particular, lo que causaba problemas de disponibilidad y fallos en el manejo de sesiones.
### ¿Qué beneficios ofrecen los JSON Web Tokens?
Los JWT se destacan por ser una tecnología sin estado (stateless), permitiendo que toda la información necesaria para autenticar se incluya directamente en el token:
- ***Escalabilidad y Distribución:*** Al no depender del almacenamiento en el servidor, los JWT permiten la creación de sistemas distribuidos con balanceo de carga en diferentes nodos y servidores.
- ***Compatibilidad Multi-Plataforma:*** A diferencia de las cookies, que son eficaces solamente dentro de navegadores, los JWT son ideales para aplicaciones móviles y otros tipos de cliente.
- ***Seguridad:*** Los tokens pueden ser firmados y verificados, asegurando que solo quienes tengan la clave secreta puedan validarlos.
### Comprendiendo la estructura de un JSON Web Token
Un JWT tiene una estructura clara que facilita su uso en múltiples aplicaciones. Esta se compone de tres partes separadas por puntos:
1. ***Header:*** Contiene la información sobre el algoritmo de encriptación utilizado (como HS256) y el tipo de token.
2. ***Payload:*** Es el corazón del JWT, donde se almacena la información esencial como el sub (subject), que identifica al usuario, y otros atributos personalizados.
3. ***Signature:*** Es una firma que combina el header y el payload usando una clave secreta. Solo aquel con la clave podrá verificar la autenticidad del token.
### ¿Cómo se utiliza el header en un JWT?
El header de un JWT especifica tanto el algoritmo de encriptación como el tipo de token. Por lo común, estos parámetros no se modifican y garantizan que los receptores del token sepan cómo procesar la información que sigue.
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
### ¿Qué información se incluye en el payload?
La sección de payload puede incluir cualquier tipo de claims, como la identidad del usuario, roles, permisos y cualquier otra información relevante que necesites para autenticar y autorizar peticiones. Todo esto sucede sin comprometer la seguridad porque estos datos son parte de un token firmado.
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```
### ¿Cómo asegura la signature la integridad del JWT?
La signature es vital para garantizar que el token no ha sido alterado. Este se genera en el back-end combinando el header y el payload con una clave secreta conocida solo por el back-end. Esto permite que el servidor verifique si el token ha sido manipulado.
```json
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload), 
  secret
)
```
La adopción de JSON Web Tokens transformó profundamente las estrategias de autenticación y seguridad en aplicaciones modernas. Gracias a su flexibilidad, compatibilidad y enfoque sin estado, los JWT representan una herramienta poderosa para desarrollar sistemas seguros y escalables en diversas plataformas.

## Firmar y verificar tokens
### ¿Qué son y cómo funcionan los JSON Web Tokens en JavaScript?
JSON Web Tokens (JWT) son un estándar de seguridad usado para compartir información de manera segura entre dos partes. Estos tokens contienen información codificada que puede ser desencriptada por el receptor si tiene el secreto correcto. En esta guía, aprenderemos a generar, firmar y verificar un JWT utilizando la librería JSON Web Token en Node.js, comprendiendo su estructura y manejo adecuado.
### ¿Cómo instalar y utilizar la librería JSON Web Token?
Instalar y usar la librería JSON Web Token en Node.js es un proceso esencial para trabajar con JWT.
1. Instala la librería usando npm:
```cmd
npm install jsonwebtoken
```
2. Importa y prepara la librería en tus archivos de JavaScript:
```js
const jwt = require('jsonwebtoken');
```
3. Defina un secretKey, que debería almacenarse como una variable de entorno para garantizar la seguridad:
```js
const secret = 'mySecretKey';
```
### ¿Cómo generar y firmar un JSON Web Token?
Para generar un JWT, es crucial definir qué datos deben codificarse dentro del token. Aquí te mostramos cómo firmar un token:
1. Define el payload. Este es el conjunto de datos que se incluirán en el token:
```js
const payload = {
  sub: 1,
  scope: 'customer'
};
```
2. Crea una función para firmar el token:
```js
function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}
```
3. Genera el token y observa las partes que lo conforman:
```js
const token = signToken(payload, secret);
console.log(token);
```
El token generado constará de tres partes: cabecera, payload y firma. Solo el backend que posee el secreto puede verificar esta firma, garantizando que el token es auténtico y no ha sido alterado.
### ¿Cómo verificar y asegurar un JSON Web Token?
La verificación de un JWT es fundamental para garantizar que el token es válido y no ha sido alterado.
1. Crea una función para verificar el token, pasando el token y el secreto:
```js
function verifyToken(token, secret) {
  try {
    const data = jwt.verify(token, secret);
    console.log(data);
  } catch (err) {
    console.error('Invalid token');
  }
}
```
2. Usar el token generado para verificarlo:
```js
verifyToken(token, secret);
```
Si la verificación es correcta, se accede a los datos encapsulados en el payload. Si ocurre un error de verificación, indica que el secreto o el token son incorrectos.
### ¿Cuáles son las mejores prácticas para manejar JWT?
Aquí te ofrecemos algunas recomendaciones para trabajar eficazmente con JWT:
- ***No almacenar información sensible en el payload:*** Cualquier usuario puede decodificar el payload, por lo que no es seguro para datos sensibles.
- ***Manejar el secreto prudentemente:*** El secreto solo debe ser conocido por el backend. Almacénalo como una variable de entorno y nunca en el código fuente.
- ***Implementar un sistema de expiración y actualización de tokens:*** Usa tokens de actualización (refresh tokens) para generar nuevos tokens cada cierto tiempo, mejorando la seguridad.
- ***Limitar el tiempo de vida del token:*** Define una expiración breve para los tokens de acceso, mejorando la seguridad en caso de que un token sea comprometido.

Finalmente, recuerda que la seguridad de JWT se basa en la gestión del secreto y la aplicación de las mejores prácticas, como la rotación de tokens y el uso de tokens de actualización. Aprende y aplica correctamente estos principios y herramientas para proteger tus aplicaciones. ¡Sigue explorando y aprendiendo sobre el desarrollo seguro!

## Generar JWT en el servicio
### ¿Cómo implementar la generación de un token en una API?
Implementar la generación de tokens en tu API es esencial para asegurar la autenticación y autorización de los usuarios. En este contexto, al usuario, una vez autenticado, se le debe otorgar un token que permita manejar su sesión y conectarse a otros endpoints. Veamos cómo implementar esta lógica utilizando `JSON Web Tokens` (JWT).
### ¿Cómo generar un token?
1. ***Importación de librerías:*** Comienza importando la librería de JSON Web Token. Esto es crucial ya que te permitirá trabajar con JWT en tu aplicación.
```js
const jwt = require('jsonwebtoken');
```
2. ***Definir el payload:*** El payload contiene la información que se almacenará en el token. Esto puede incluir cualquier dato relevante, como el ID del usuario. En nuestro caso, utilizaremos el ID y el rol del usuario.
```js
const payload = {
    id: req.user.id,
    role: req.user.role
};
```
3. ***Generar el token:*** Una vez que se tiene el payload, se genera el token utilizando una clave secreta que no debe estar en el código fuente, sino configurada como una variable de entorno.
```js
const token = jwt.sign(payload, process.env.JWT_SECRET);
```
### ¿Cómo manejar el secreto de la firma del token?
Es importante que el secreto utilizado para firmar el token sea seguro y esté gestionado como una variable de entorno. Esto lo proporciona mayor seguridad frente a ataques. Aquí te explicamos cómo:
- Crear una variable de entorno: Define una variable de entorno llamada `JWT_SECRET` que contenga el secreto.
  Ejemplo en `.env`:
```js
JWT_SECRET=your-secret-key
```
- Generación del secreto: Utiliza herramientas en línea como [Keygen.io](Keygen.io) para generar claves seguras mediante algoritmos robustos.
### ¿Cómo reiniciar el entorno de desarrollo?
Después de configurar las variables de entorno, es esencial reiniciar tu entorno de desarrollo para que los cambios surtan efecto. Si no lo haces, podrías enfrentar errores, como el que el secreto no tenga un valor asignado.
1. ***Detener la aplicación:*** Si tu aplicación está corriendo, asegúrate de detenerla antes de realizar cambios.
2. ***Reiniciar la aplicación:*** Una vez configurada la variable de entorno, corre nuevamente tu aplicación para cargar los nuevos valores.
### ¿Qué esperar al probar el login?
Una vez implementada la lógica de generación de tokens, al probar el endpoint de login, se espera lo siguiente:
- ***Respuesta:*** El sistema debería devolver tanto la información del usuario como el token recién generado.
- ***Funcionalidad segura:*** Este token le permitirá al usuario manejar su sesión de manera segura en los siguientes requests.

Por último, asegúrate de aplicar estos tokens en la protección de las rutas de tu API, forzando a los usuarios a enviar el token para acceder a recursos protegidos. ¡Así garantizas una capa más de seguridad y control en tus servicios!

## Protección de rutas
### ¿Cómo se protegen las rutas con JWT?
Para proteger nuestras rutas de una manera más segura, hemos llegado al punto crítico de implementar JWT (JSON Web Tokens) con Passport en nuestro sistema. Este proceso garantiza que solamente los usuarios autenticados tengan acceso a ciertas partes de nuestro backend. A continuación, te guiaré a través de los pasos necesarios para implementar esta estrategia.
### ¿Qué necesitamos para comenzar?
- ***Passport JWT:*** Es una estrategia de autenticación que utiliza JWT para proteger rutas.
- ***JWT Strategy y Extract JWT:*** Ambos son fundamentales para ubicar y validar el token en las solicitudes.
### Pasos para implementar JWT Strategy
1. ***Instalación de Passport JWT:*** Desde la terminal, ejecuta la instalación de la librería Passport JWT. Con este paquete tendrás lo necesario para implementar la estrategia.
```cmd
npm install passport-jwt
```
2. ***Configuración de la estrategia:*** Crea una nueva estrategia llamada JWT importando `Strategy` y `ExtractJwt` de `passport-jwt`.
```js
const { Strategy, ExtractJwt } = require('passport-jwt');
```
3. ***Definición de opciones:*** Configura las opciones necesarias para la estrategia. Define de dónde se extraerá el token (usualmente del header como Bearer token) y especifica el secreto para validar dicho token.
```js
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret // Obtén esto de tu configuración
};
```
4. ***Creación de la estrategia JWT:*** Inicializa la estrategia JWT utilizando las opciones anteriores. Passport verificará el token y te proporcionará el payload si es válido.
```js
const jwtStrategy = new Strategy(options, (payload, done) => {
    // Verificación del token
    if (isValid(payload)) {
        return done(null, payload);
    }
    return done(null, false);
});
```
5. ***Integración en el sistema:*** Una vez configurada la estrategia, asegúrate de importarla y usarla donde necesites proteger rutas.
```js
passport.use(jwtStrategy);
```
### ¿Cómo se protege un endpoint específico?
Para proteger un endpoint, como por ejemplo el de creación de categorías, sigue los pasos siguientes:
1. ***Definir la ruta protegida:*** Usa la estrategia `jwt` para proteger el endpoint deseado. Aquí se utiliza Passport para verificar la autenticidad del JWT.
```js
router.post('/categories', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Lógica para crear una categoría
});
```
2. ***Verificación en Insomnia o entorno similar:*** Asegúrate de enviar el token en los headers de la petición. Por ejemplo, en Insomnia, configura el tipo de autentificación como Bearer token para enviar el JWT.

3. ***Pruebas y validaciones:*** Asegúrate de que al enviar un JWT válido, el sistema permite realizar acciones específicas, como crear una categoría. Si el JWT es inválido o está corrupto, el acceso debe ser denegado.
### ¿Qué es un Bearer Token y cómo se usa?
Un Bearer token es simplemente un tipo de token que se envía en el header `Authorization` de una petición HTTP. Este se utiliza para autenticar solicitudes y validar que son realizadas por un usuario legítimo. Importante:
- Debe enviarse en el formato: `Bearer <token>`
- Asegúrate de enviar el token correcto sin alteraciones
- La clave `authorization` debe incluirse correctamente en los headers
### ¿Cuáles son los siguientes pasos?
¡Felicidades! Ya tienes una ruta protegida con JWT. Continúa asegurando el resto de tus rutas. Asegúrate de que no solo las operaciones de creación están protegidas, sino también las de modificación y eliminación. Así, evitarás que usuarios no autorizados realicen acciones críticas en tu sistema.  
Aprender y experimentar con seguridad de APIs es sumamente importante. Protege eficazmente tu aplicación y sigue investigando en este fascinante campo de la tecnología. ¡Éxito en tu implementación y sigue adelante con tu desarrollo!

## Control de roles
### ¿Cómo gestionar los permisos por roles en una API segura?
La correcta gestión de permisos es crucial al desarrollar sistemas seguros. No basta con autenticar usuarios; también es imprescindible controlar quién puede realizar ciertas acciones dentro de la aplicación. En este artículo, exploraremos cómo manejar roles de usuario y proteger endpoints en una API usando autenticación JWT (JSON Web Token).
### ¿Por qué es esencial la gestión de roles?
En un sistema típico, no todos los usuarios deben tener las mismas capacidades. Por ejemplo, solo los administradores deberían poder crear o modificar productos, mientras que los clientes podrían limitarse a acciones como registrarse y crear órdenes de compra. La gestión de roles permite:
- ***Restringir accesos:*** Solo usuarios autorizados pueden realizar ciertas acciones.
- ***Mantener seguridad y orden:*** Minimiza riesgos de acciones no deseadas por parte de usuarios.
### ¿Cómo implementar middleware para roles en JWT?
Agregaremos un middleware para verificar si el usuario que realiza una petición tiene el rol adecuado.
```js
function checkAdminRole(req, res, next) {
    if (req.user.role === 'admin') {
        next(); // Permiso concedido
    } else {
        res.status(403).json({ message: 'No autorizado' }); // Acceso denegado
    }
}
```
Para hacer esta verificación, aprovechamos que después de la autenticación JWT, el payload desencriptado está disponible a través de `req.user`.
### ¿Cómo manejar múltiples roles de forma dinámica?
Crear un middleware específico por cada rol puede volverse complicado. En su lugar, podemos usar un enfoque más flexible con una función que permita el acceso a varios roles:
```js
function checkRoles(...roles) {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next(); // Usuario autorizado
        } else {
            res.status(403).json({ message: 'No autorizado' });
        }
    };
}
```
Con esta función, podemos especificar qué roles tienen permiso para acceder a un determinado endpoint, simplificando la gestión de permisos.
### ¿Cómo utilizar y probar estos middleware?
1. ***Definir roles en tus rutas:*** Al definir las rutas en tu aplicación, especifica qué roles tienen acceso.
```js
app.get('/category', checkRoles('admin', 'seller'), (req, res) => {
    // Código para devolver categorías
});
```
2. ***Probar con herramientas como Insomnia:*** Al enviar solicitudes utilizando tokens de usuario con diferentes roles (admin, cliente, etc.), verifica que cada usuario solo accede a lo que debiera.
### ¿Existen soluciones más avanzadas?
Sí, para aplicaciones donde los requisitos de permisos son más complejos, puedes considerar utilizar librerías como `Access Control`, que ofrece una forma más robusta de gestionar permisos de usuario basados en roles y acciones.
### ¿Qué otras consideraciones deberías tener?
- ***Endpoints públicos:*** Decide cuidadosamente cuáles deben estar protegidos y cuáles pueden ser accesibles sin autenticación.
- ***Gestión de errores:*** Proporciona mensajes claros cuando un usuario no está autorizado para acceder a un recurso.

La implementación de un sistema de roles bien estructurado es una base sólida para la seguridad de tu API, permitiendo un control granular sobre lo que cada clase de usuario puede y no puede hacer. Continúa explorando estas best practices para asegurar que tu aplicación se mantiene segura y eficiente.

## Obteniendo órdenes del perfil
### ¿Cómo manejar las órdenes de compra con autenticación?
En la implementación de sistemas que gestionan órdenes de compra, es esencial proteger la información de los usuarios. En la clase, hemos aprendido cómo, mediante el uso de JWT (JSON Web Tokens), podemos hacer que nuestras aplicaciones sean más seguras y a la vez más eficientes. Este proceso permite que los clientes autenticados consulten sus órdenes sin tener que enviar su identificador repetidamente. Vamos a desglosar este procedimiento.
### ¿Cómo crear un router para manejar las órdenes de compra?
Para empezar, necesitamos un nuevo router que maneje las órdenes de compra por usuario autenticado. Usamos Express y JWT para desarrollar este nuevo endpoint:
```js
const express = require('express');
const passport = require('passport');
const ordersService = require('../services/ordersService');
const router = express.Router();

router.get('/my-orders', 
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const orders = await ordersService.findByUser(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);
```
Este nuevo router crea un endpoint que devuelve las órdenes de compra para el usuario autenticado, extrayendo su ID del payload del token.
### ¿Cómo realizar consultas complejas con asociaciones?
Para manejar la relación entre tablas, empleamos Sequelize, que ofrece la capacidad de realizar consultas complejas. En este caso, tenemos relaciones de uno a uno entre usuario y cliente y cliente y orden.
```js
async function findByUser(userId) {
  return Order.findAll({
    include: [
      {
        association: 'customer',
        include: [{ association: 'user', where: { id: userId } }]
      }
    ]
  });
}
```
Esta consulta utiliza las asociaciones para encontrar las órdenes correspondientes al usuario autenticado, sin requerir el envío explícito del ID del cliente en cada solicitud.
### ¿Qué beneficios ofrece el uso de JWT en esta implementación?
El uso de tokens JWT ofrece varias ventajas:
- ***Seguridad:*** Los tokens están firmados y tienen una fecha de expiración, lo que previene su uso indevido.
- ***Simplicidad:*** Permite evitar la transmisión constante de credenciales o identificadores del usuario, ya que el token almacena información suficiente para autenticación.
- ***Escalabilidad:*** Facilita la implementación en aplicaciones distribuidas, donde la autenticación se puede descentralizar de manera segura.
### Reto adicional: Automatizando la asociación en nuevas órdenes de compra
Cuando un usuario autenticado desea crear una nueva orden de compra, el sistema debería poder deducir su `customerId` a partir del `userId` almacenado en el token:
```js
async function createOrder(data, userId) {
  const customer = await Customer.findOne({ where: { userId: userId } });
  if (!customer) throw new Error('Customer not found');
  const newOrder = await Order.create({
    ...data,
    customerId: customer.id
  });
  return newOrder;
}
```
Con este enfoque, eliminamos el paso manual de tener que enviar el `customerId`, lo que simplifica el proceso para el usuario y minimiza errores potenciales.  
Este tipo de implementaciones no solo ayudan a mantener la integridad y seguridad de los datos del usuario, sino que también proporcionan una experiencia de usuario más fluida y agradable. ¡Sigue explorando y mejorando tus habilidades en el manejo de autenticación y seguridad en aplicaciones web!

## Manejo de la autenticación desde el cliente
### ¿Cómo manejar la autenticación y autorización con tokens desde el cliente?
La autenticación y autorización basada en tokens es un aspecto esencial cuando se desarrolla una aplicación web. Adoptar prácticas adecuadas garantiza una experiencia de usuario fluida y segura. Abordemos de qué manera un Single Page Application (SPA) desarrollado en Angular, React o Vue puede gestionar sesiones al conectarse a una API.
### ¿Cuál es la importancia de almacenar el token?
El manejo correcto de un token después de un login exitoso es crucial. El token es el corazón de la autenticación, ya que se utiliza para autorizar todas las peticiones a la API. ¿Qué deberíamos considerar?
- ***Guardar el token:*** Es esencial preservar el token que la API nos provee. Esto se puede hacer en `cookies` o en `Local Storage`, aunque las cookies son la opción más segura.
- ***Estado de inicio de sesión:*** Mantén un estado de login en la aplicación. Esto se puede registrar en Local Storage o cookies para indicar que un usuario ha iniciado sesión.
### ¿Cómo enviar el token en cada petición?
Una vez el token está asegurado, es primordial que sea enviado con cada solicitud a la API. Aquí algunos pasos para asegurarse de ello:
- ***Utilización del encabezado de autorización:*** Cada request debería incluir el token en el encabezado de autorización con el formato: `Authorization: Bearer <token>`.
- ***Intercepción de peticiones:*** Con bibliotecas como Axios o en frameworks como Angular, es posible interceptar las peticiones para añadir automáticamente el token, evitando hacerlo manualmente en cada request.
### ¿Cuáles son las tácticas para la expiración del token?
Los tokens tienen una vida útil limitada por razones de seguridad. Así es como puedes manejarlos:
- ***Tokens con expiración:*** Usualmente, se aconseja que los tokens caduquen entre 15 a 20 minutos. Sin embargo, cortar la sesión sin previo aviso puede afectar la experiencia de usuario.
- ***Implementación de Refresh Tokens:*** Aprovecha un refresh token otorgado por la API para solicitar nuevos tokens cuando el access token caduque. Este proceso puede ser automatizado para que sea transparente para el usuario, ofreciendo continúas renovaciones sin necesidad de un nuevo inicio de sesión.
### ¿Cómo validar y manejar permisos de usuario?
La seguridad y la gestión de permisos están interrelacionadas en el uso de tokens:
- ***Verificación de permisos:*** Con el token, se puede consultar al backend el perfil del usuario. Esto asegura que se muestren sólo las funciones autorizadas para el rol específico del usuario.
- ***Seguridad adicional:*** Para los desarrolladores más conscientes de la seguridad, se podría realizar solicitudes adicionales para obtener el perfil del usuario en lugar de almacenar información sensible localmente.

Con estas consideraciones prácticas, podrás manejar la autenticación y autorización de manera eficiente y segura en tu aplicación. Al seguir estos lineamientos, puedes asegurar una experiencia de usuario positiva mientras mantienes la integridad y seguridad de tu aplicación.

## Cómo enviar emails con Node.js
### ¿Cómo implementar la recuperación de contraseñas en una API con Node.js?
Implementar un sistema de recuperación de contraseñas es un elemento crucial en cualquier aplicación moderna. En esta sección, exploraremos cómo coordinar la recuperación de contraseñas usando una API construida con Node.js, Express, y la útil librería [NodeMailer](https://nodemailer.com/about/) para el envío de correos electrónicos.
### ¿Cómo enviar correos para la recuperación de contraseñas?
El primer paso para la recuperación de contraseñas es configurar el envío de correos. Vamos a utilizar la librería **NodeMailer**, que simplifica el proceso de envío de correos en Node.js, al ofrecer servicios como envío de textos enriquecidos o incluso con adjuntos.
### Instalación y configuración de NodeMailer
Para instalar NodeMailer, usa el siguiente comando en tu terminal:
```cmd
npm install nodemailer
```
Con NodeMailer instalado, es momento de crear un archivo base que usaremos para el envío de correos:
```js
const nodemailer = require('nodemailer');

async function sendEmail() {
    // Configuración del transporte usando un servidor SMTP de prueba
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    // Detalles del envío del correo
    let info = await transporter.sendMail({
        from: '"Ejemplo App" <noreply@example.com>',
        to: "usuario@ejemplo.com",
        subject: "Recuperación de contraseña",
        text: "Recupera tu contraseña siguiendo este enlace",
        html: "<b>Recupera tu contraseña siguiendo este enlace</b>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

sendEmail().catch(console.error);
```
### ¿Cómo hacer pruebas con servidores SMTP falsos?
NodeMailer permite el uso de servicios SMTP falsos, ideales para probar nuestro flujo sin enviar correos reales. Estos servidores, como Ethereal, proporcionan cuentas de prueba para enviar correos sintéticamente.
### Configuración de un servidor SMTP de prueba
Para utilizar [Ethereal](ethereal.email), accede a `ethereal.email` y genera una cuenta de prueba. Con esta configuración, podrás emular un flujo de correos electrónicos sin enviar mensajes reales a usuarios.
```js
let testAccount = await nodemailer.createTestAccount();
let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass,
    },
});
```
### ¿Cómo enviar correos reales con NodeMailer y Gmail?
Si deseas pasar de un entorno de prueba a uno real, puedes usar servidores SMTP reales como el de Gmail. Para hacerlo, necesitas configurar tu cuenta de Gmail para permitir el acceso de “apps menos seguras”.
### Configuración con Gmail SMTP
Asegúrate de seguir los pasos a continuación para usar Gmail como servidor SMTP:
1. Habilitar la autenticación de dos factores en tu cuenta de Google.
2. Crear una contraseña de aplicación desde la sección de seguridad de tu cuenta de Google.

Con la contraseña generada, modifique tu configuración de NodeMailer:
```js
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'tuusuario@gmail.com',
        pass: 'tupasswordgeneradaporapp',
    },
});
```
Este fragmento muestra cómo configurar NodeMailer para enviar correos reales a través de Gmail. Recuerda siempre almacenar credenciales sensibles como variables de entorno para asegurar tu aplicación.
### Recomendaciones finales y buenas prácticas
Veamos algunos consejos y mejores prácticas cuando trabajas con NodeMailer y el envío de emails mediante servidores SMTP:
- ***Seguridad***: Siempre utiliza variables de entorno para almacenar credenciales sensoriales, y evita exponer contraseñas en tu código.
- ***Pruebas locales***: Aprovecha los servicios SMTP falsos para realizar pruebas sin correr riesgos de enviar correos reales.
- ***Registro y Monitoreo***: Implementa un sistema de logging para registrar claramente los detalles de los envíos de correos y detectar cualquier fallo o problema en el proceso.
- ***Manejo de Errores***: Implementa manejo de excepciones robusto para controlar errores en el envío de correos y asegurar que la aplicación pueda recuperarse de ellos.

Con estos conceptos y configuraciones, puedes implementar un sistema robusto de recuperación de contraseñas en tu aplicación. Este es solo el comienzo de un enfoque extensible para mejorar tanto la seguridad como la experiencia del usuario en tus aplicaciones.

## Implementando el envío de emails
### ¿Cómo implementar la recuperación de contraseñas en tu API?
En el vasto universo del desarrollo de software, la seguridad de las credenciales de los usuarios es primordial. Implementar un sistema de recuperación de contraseñas es un proceso esencial para asegurar la confianza y protección de los usuarios. Hoy te enseñaremos cómo puedes establecer un endpoint seguro de recuperación de contraseñas en tu API. Vamos a profundizar en el código y los pasos necesarios para implementarlo correctamente.
### ¿Cuál es el primer paso para crear la funcionalidad de recuperación?
Comenzamos creando una nueva ruta en la API para gestionar la recuperación de las contraseñas. Esta ruta utilizará un método POST y no requerirá autenticación, ya que precisamente está diseñada para aquellos usuarios que no pueden acceder a sus cuentas:
```js
// Creación de la ruta de recuperación
app.post('/recovery', (req, res) => {
    const { email } = req.body;
    // Implementación posterior
});
```
En esta ruta, lo primordial es capturar el email del usuario que desea recuperar su contraseña.
### ¿Cómo centralizar la lógica de autenticación?
Mantener la lógica dispersa en varias partes del código puede ser problemático, sobre todo en términos de mantenimiento y escalabilidad. Por ello, se debe migrar toda la lógica de autenticación a un servicio unificado:
1. Crear un nuevo archivo `auth.service.js`.
2. Migrar la lógica de autenticación de lugares dispersos a este archivo.
3. Utilizar este servicio en `local strategy` para obtener un usuario en base al email y password.
```js
// auth.service.js
class AuthService {
    async getUser(email, password) {
        // Lógica para obtener y validar usuario
    }

    async signToken(user) {
        // Lógica para firmar el token
    }

    async sendEmail(user) {
        // Lógica para enviar el correo electrónico
    }
}

module.exports = AuthService;
```
### ¿Cómo configurar y utilizar el envío de correos?
La herramienta NotMailer es una opción práctica para el envío de correos electrónicos de recuperación. Aquí es donde se configura el transporter de NotMailer y se implementa el envío del email de recuperación:
1. Importar la librería `notmailer`.
2. Configurar el transporter con las credenciales adecuadas.
3. Crear la funcionalidad para enviar un email de recuperación:
```js
const nodemailer = require('nodemailer');

// Configuración del transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Función para enviar correo
async function sendRecoveryEmail(email) {
    let info = await transporter.sendMail({
        from: '"Service Name" <service@example.com>',
        to: email,
        subject: "Recovery Password",
        text: "Click here to reset your password.",
    });

    console.log('Message sent: %s', info.messageId);
}
```
### ¿Cómo asegurar el proceso de recuperación?
Al implementar la recuperación de contraseñas, es crucial verificar que el email proporcionado existe en la base de datos. Esto evita que se envíen emails a direcciones que no forman parte del sistema:
```js
async function recovery(req, res) {
    try {
        const { email } = req.body;
        const user = await userService.findUserByEmail(email);

        if (!user) {
            throw new Error('Unauthorized');
        }

        await sendRecoveryEmail(user.email);
        res.status(200).json({ message: 'Mail sent' });

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
```
### ¿Cómo realizar pruebas y ajustes finales?
Finalmente, es importante verificar que el endpoint es funcional mediante pruebas en la aplicación, por ejemplo, usando herramientas como Insomnia o Postman. Al realizar estos ensayos, asegúrate de:
- Probar con emails válidos y no válidos.
- Revisar que el sistema no revele información innecesaria que un atacante podría usar maliciosamente.

La configuración y variables sensibles, como el usuario y la contraseña del email, deben almacenarse como variables de entorno para evitar cualquier filtración de información. Esta práctica es esencial para mantener la seguridad y privacidad de tus datos y los de tus usuarios.
### Conclusiones y próximos pasos
Implementar una ruta de recuperación de contraseña no solo mejora la experiencia del usuario, sino también refuerza la seguridad de tu aplicación. Asegúrate de seguir desarrollando y mejorando tus servicios para ofrecer funcionalidades robustas y seguras. ¡El viaje del aprendizaje continuo en programación siempre tiene nuevos y emocionantes horizontes por descubrir!

## Generando links de recuperación
### ¿Cómo generar enlaces de recuperación de contraseña de forma segura?
Generar enlaces de recuperación de contraseña es crucial para garantizar la seguridad de tus usuarios. Vamos a ver cómo podemos hacer esto de manera eficiente y segura utilizando un método separado para enviar correos electrónicos, permitiéndonos reutilizar el código para otras funcionalidades.
### ¿Cómo separar responsabilidades en la gestión de correos electrónicos?
Para empezar, separamos la parte de envío de correos electrónicos en una función distinta para poder reutilizarla en diferentes casos de uso. Creamos un método llamado `resetPassword` que recibirá el email del usuario y ejecutará la lógica de envío de correo. Aquí es importante mantener las configuraciones de transporte, mientras que desacoplamos la lógica específica del correo.
### ¿Cómo funciona el proceso de creación del token de recuperación?
El proceso parte de la creación de un token usando `JWT`, que asegurará que el enlace sea único y seguro para cada usuario.
```js
const payload = { sub: user.ID };
const token = generateToken(payload, secret);
```
El token generado deberá enviarse al usuario dentro de un enlace, el cual permitirá la recuperación de su contraseña en el front end cuando sea necesario.
### ¿Cómo integrar el enlace de recuperación en el correo electrónico?
Una vez generado el token, lo integramos en un enlace dentro del correo que permite al usuario acceder directamente al sistema de recuperación de contraseñas:
```js
const link = `http://myfrontend.com/recovery?token=${token}`;
```
Es fundamental que el front end cuente con una vista que maneje este proceso de recuperación y capture el token proporcionado.
### ¿Cómo manejar la seguridad del token?
El token no solo debe ser único, sino que además debe almacenarse de manera segura en la base de datos. Se debe crear un campo adicional en la base de datos para almacenar este token, lo cual requiere una migración en una base de datos relacional:
```js
await queryInterface.addColumn('User', 'recoveryToken', {
  type: DataTypes.STRING,
  allowNull: true,
});
```
### ¿Cómo se verifica y expira el token?
Este token debe configurarse para que expire automáticamente después de un tiempo definido (por ejemplo, 15 minutos), proporcionando un nivel adicional de seguridad y obligando al usuario a solicitar un nuevo enlace en caso de caducar.
### ¿Cómo preparar la base de datos para la recuperación de contraseñas?
Al ejecutar el comando de migración, agregamos un nuevo campo `recoveryToken` en la base de datos:
```cmd
npx sequelize-cli db:migrate
```
Esto nos permitirá realizar un "match" con el token enviado al usuario para validar su autenticidad.
### ¿Qué hacer después de enviar el enlace de recuperación?
Una vez el usuario reciba el correo y acceda al enlace, el sistema de back end debe estar preparado para:
- Verificar la validez del token.
- Permitir al usuario cambiar su contraseña.
- Alertar a los responsables del front end para adecuar las vistas y funcionalidades necesarias.

La capacidad de desarrollar un sistema seguro y eficiente de recuperación de contraseñas es un aspecto crucial del desarrollo de software moderno. A través de separaciones lógicas y una estructura de gestión de tokens, se puede proporcionar a los usuarios una experiencia fluida y segura al recuperar sus credenciales.

## Validando tokens para cambio de contraseña
### ¿Cómo gestionar el cambio de contraseña con tokens en nuestra aplicación?
En el mundo del desarrollo web, la seguridad es primordial. Una de las prácticas esenciales es manejar adecuadamente los cambios de contraseña, asegurando que todo el flujo resguarde la información del usuario. En este contenido, exploraremos cómo implementar un sistema seguro de recuperación y cambio de contraseñas utilizando tokens.
### ¿Cuál es el flujo del proceso de recuperación de password?
El proceso de recuperación de contraseñas es más que simplemente enviar un correo con un enlace de restablecimiento. Involucra varios pasos para garantizar que solo el usuario legítimo pueda cambiar su contraseña:
1. ***Interfaz de recuperación de contraseña:*** El usuario proporciona su email en un formulario.
2. ***Validación del correo:*** Se verifica que el email existe en la base de datos.
3. ***Generación del token:*** Se crea un token de quince minutos y se envía al usuario por correo.
4. ***Recepción del correo:*** El usuario recibe un correo con un link que incluye el token.
5. ***Interfaz para cambiar la contraseña:*** Al hacer clic en el link, el usuario accede a un formulario para introducir una nueva contraseña.
6. ***Validación y cambio de contraseña:*** Se recibe el token y la nueva contraseña, validando el token y el usuario.
### ¿Cómo se implementa el cambio de contraseña?
Para cambiar la contraseña, es esencial que el backend procese correctamente el nuevo password y valide el token. Aquí algunos pasos clave de la implementación:
- ***División del Router:*** Aparte del endpoint de login, se crea uno nuevo para el cambio de contraseña.
- ***Validación del token y datos:*** Si los datos no son válidos, se retorna un error. En caso de alguna irregularidad, podemos utilizar bibliotecas como `Boom` para manejar errores y lanzar excepciones.
```js
try {
  const payload = JWT.verify(token, process.env.SECRET);
  const user = await User.findOne({ _id: payload.sub });

  if (!user || user.recoveryToken !== token) {
    throw Boom.unauthorized('Token inválido o usuario no encontrado');
  }

  // Eliminar el token y actualizar la contraseña
  user.recoveryToken = null;
  user.password = bcrypt.hashSync(newPassword, saltRounds);
  await user.save();
} catch (error) {
  handleErrors(error);
}
```
### ¿Qué aspectos de seguridad se deben considerar?
La seguridad en la gestión de contraseñas es esencial para proteger a los usuarios. Algunos aspectos a considerar incluyen:
- ***Capa de validación de datos:*** Implementar validaciones para asegurar que los `token` y `password` satisfagan criterios de seguridad, como ser alfanuméricos o tener una longitud mínima y máxima.
- ***Eliminación del token:*** Una vez cambiada la contraseña, el token debe ser invalidado para evitar su reutilización.
- ***Hashes seguros de contraseñas:*** Utilizar funciones de hash como `bcrypt` para garantizar que las contraseñas no sean almacenadas en texto plano.
- ***No exponer tokens en las respuestas:*** Evitar devolver información sensible como `recoveryToken` o contraseñas en las respuestas de la API.
### ¿Qué podemos aprender de este práctica?
Implementar un sistema seguro de recuperación de contraseñas supone un aprendizaje valioso en la gestión de seguridad de aplicaciones. Al crear este tipo de funcionalidades, practicamos habilidades cruciales como:
- ***Integración con servicios de correo electrónico:*** Aprendimos a enviar correos utilizando servidores SMTP como los de Gmail.
- ***Gestión de tokens seguros:*** Asignamos y validamos tokens firmados con secret keys, asegurando un proceso de cambio de contraseña confiable.
- ***Desarrollo de flujo de usuario:*** Creamos interfaces intuitivas que guían al usuario a través del proceso de recuperación y actualización de contraseña.

El camino hacia una gestión de seguridad efectiva es continuo, pero cada implementación brinda un avance significativo en tus habilidades como desarrollador. Sigue adelante, cada desafío que superas enriquece tu experiencia y te aproxima más a la excelencia.

## 
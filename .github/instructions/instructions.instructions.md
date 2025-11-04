---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
---# Project Context and Coding Guidelines

1. **Project Structure**: Understand the overall structure of the project, including key modules and their responsibilities.

Monolito modularizado, con separación clara entre capas de presentación, lógica de negocio y acceso a datos.

Modules: encapsulan la lógica relacionada y proporcionan una interfaz para interactuar con otras partes de la aplicación.

Controllers: manejan las solicitudes HTTP y coordinan la interacción entre la vista y el modelo. Cada controlador debe ser responsable de una única entidad o conjunto de funcionalidades relacionadas. 
Estructura típica de un controlador: endpointos RESTful (GET, POST, PATCH, DELETE) para gestionar recursos específicos.
Ejemplo: UserController, ProductController.
Endpoints RESTful: deben seguir convenciones estándar para nombrar y estructurar las rutas (por ejemplo, /user para obtener todos los usuarios, /user/{id} para obtener un usuario específico).
GET /api/v1/{resource}.
GET /api/v1/{resource}/{id|code|uuid}.
POST /api/v1/{resource}/create.
PATCH /api/v1/{resource}/{id}/update.
DELETE /api/v1/{resource}/{id}/delete.

Services: contienen la lógica de negocio y las reglas del dominio.
GET: devuelve datos sin modificar el estado del servidor.
POST: crea un nuevo recurso en el servidor. No devuelve el recurso creado, solo un estado de éxito o error.
PUT/PATCH: actualiza un recurso existente en el servidor. No devuelve el recurso actualizado, solo un estado de éxito o error.
DELETE: elimina un recurso del servidor. No devuelve datos, solo un estado de éxito o error.

Entities/Models: representan las estructuras de datos y las relaciones entre ellas.
Son explicitamente mapeadas a tablas en la base de datos y descriptivas de la lógica de negocio.
Contiene atributos y métodos relacionados con la entidad.

Dtos: objetos de transferencia de datos utilizados para transportar datos entre capas.
Documentadas con swagger y validaciones con class-validator y class-transformer.
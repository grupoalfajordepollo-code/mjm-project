# MJM 3D - Tienda de Impresion 3D

E-commerce para vender productos de impresion 3D. Para levantar el proyecto necesitas Node.js y MySQL.

---

## Paso 1: Instalar programas necesarios

- [Node.js](https://nodejs.org/) (version 18 o superior) - trae npm incluido
- [MySQL](https://dev.mysql.com/downloads/mysql/) - el servidor de base de datos

---

## Paso 2: Clonar el repositorio

```bash
git clone https://github.com/grupoalfajordepollo-code/mjm-project.git
cd mjm-project
```

---

## Paso 3: Configurar el Backend

```bash
cd Back
npm install
```

Crear un archivo llamado `.env` dentro de la carpeta `Back/` con este contenido:

```env
DB_NAME=mjm_3d
DB_USER=root
DB_PASSWORD=la_password_de_tu_mysql
DB_HOST=127.0.0.1
DB_PORT=33066

JWT_SECRET=clave_secreta_desarrollo_mjm3d_2026
JWT_EXPIRES_IN=2h

OCI_TENANCY_ID=<pedir al grupo>
OCI_USER_ID=<pedir al grupo>
OCI_FINGERPRINT=<pedir al grupo>
OCI_REGION=sa-valparaiso-1
OCI_BUCKET_NAME=mjm3d-storage
OCI_NAMESPACE=axvq22kabos9
OCI_PRIVATE_KEY_PATH=<pedir al grupo>
```

**IMPORTANTE:** Cambia `DB_PASSWORD` por la password real de tu MySQL.

---

## Paso 4: Configurar el Frontend

En otra terminal:

```bash
cd Front
npm install
```

Crear un archivo llamado `.env` dentro de la carpeta `Front/` con este contenido:

```env
VITE_OCI_PUBLIC_URL=https://objectstorage.sa-valparaiso-1.oraclecloud.com/n/axvq22kabos9/b/mjm3d-storage/o/assets
```

---

## Paso 5: Crear la base de datos

Abrir MySQL y crear la base de datos:

```sql
CREATE DATABASE mjm_3d;
```

Si usas MySQL Workbench, podes crearla desde ahi. Si usas la linea de comandos:

```bash
mysql -u root -p
```

Luego escribi `CREATE DATABASE mjm_3d;` y dale enter.

---

## Paso 6: Cargar datos de prueba

```bash
cd Back
npm run seed
```

Esto crea usuarios, productos, categorias y todo lo necesario para probar.

---

## Paso 7: Levantar el proyecto

Necesitas **2 terminales abiertas al mismo tiempo**:

**Terminal 1 - Backend (el servidor):**
```bash
cd Back
npm run dev
```

**Terminal 2 - Frontend (la pagina):**
```bash
cd Front
npm run dev
```

Listo! Abrir en el navegador: **http://localhost:5173**

---

## Cuentas de prueba

| Que es | Email | Contrasena |
|--------|-------|------------|
| Administrador | admin@mail.com | `!Admin123` |
| Usuario 1 | juan@mail.com | `!Juan1234` |
| Usuario 2 | maria@mail.com | `!Maria1234` |
| Usuario 3 | carlos@mail.com | `!Carlos1234` |

Para entrar al panel de administrador ir a: **http://localhost:5173/login-admin**

---

## Que tiene el proyecto

### Paginas del sitio

- **http://localhost:5173** - Home con catalogo de productos
- **http://localhost:5173/login** - Login de usuarios normales
- **http://localhost:5173/login-admin** - Login de administradores
- **http://localhost:5173/registro** - Crear cuenta nueva
- **http://localhost:5173/panel-secured** - Panel de admin (solo admin puede entrar)

### Funcionalidades

- **Usuarios:** Registrarse, logearse, ver productos, comprar
- **Admin:** Crear/editar/borrar productos, subir imagenes, gestionar categorias
- **Carrito:** Agregar productos, ver carrito, hacer pedidos
- **Pagos:** Registrar pagos asociados a pedidos

---

## API (para los que quieran probar con Postman o similar)

Todas las rutas empiezan con `/api`. El backend corre en **http://localhost:3000**.

### Login

```
POST /api/auth/login
Body: { "email": "admin@mail.com", "password": "!Admin123" }
```

### Productos

```
GET  /api/productos          - listar todos
GET  /api/productos/1        - obtener uno por ID
POST /api/productos          - crear (requiere admin)
PUT  /api/productos/1        - actualizar (requiere admin)
DELETE /api/productos/1      - borrar (requiere admin)
```

### Categorias

```
GET  /api/categorias         - listar todas
POST /api/categorias         - crear
PUT  /api/categorias/1       - actualizar
DELETE /api/categorias/1     - borrar
```

### Usuarios

```
GET  /api/usuarios           - listar todos
GET  /api/usuarios/1         - obtener uno
POST /api/usuarios           - crear
PUT  /api/usuarios/1         - actualizar
DELETE /api/usuarios/1       - borrar
```

### Carrito e items

```
GET  /api/carritos           - listar carritos
POST /api/carritos           - crear carrito
GET  /api/items-carrito      - listar items del carrito
POST /api/items-carrito      - agregar item al carrito
```

### Pedidos

```
GET  /api/pedidos            - listar todos
POST /api/pedidos            - crear
GET  /api/pedidos/1          - obtener uno
```

### Pagos

```
GET  /api/pagos              - listar todos
POST /api/pagos              - crear
```

---

## Cosas a tener en cuenta

- **Puerto MySQL:** Esta configurado en el **33066** (no el normal 3306). Si tu MySQL usa otro puerto, cambiarlo en el `.env` de Back.
- **Las imagenes:** Se suben a Oracle Cloud. Si no tienen acceso al bucket, las imagenes no van a cargar pero el resto funciona.
- **Contrasenas:** Para registrarse necesita mayuscula, minuscula, caracter especial y minimo 6 caracteres.
- **No tocar main:** Las ramas protegidas son `main` y `dev`. Para hacer cambios crear una rama nueva.

---

## Comandos utiles

```bash
npm run dev      # levantar en modo desarrollo (con auto-reload)
npm run seed     # cargar datos de prueba
npm run db:reset # BORRAR todo y recrear las tablas (cuidado!)
npm run build    # compilar para produccion (Front)
```

---

## Git Workflow

1. Bajar de `dev`: `git checkout dev && git pull origin dev`
2. Crear rama: `git checkout -b feature/HU-ID`
3. Hacer cambios y commitear: `git add . && git commit -m "feat(HU-ID): descripcion"`
4. Subir: `git push origin feature/HU-ID`
5. Abrir PR en GitHub hacia `dev`

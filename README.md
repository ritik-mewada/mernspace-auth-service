# 🛡️ Auth Service

This is the authentication microservice for the MERN stack application. It runs in a Dockerized environment and uses PostgreSQL as the database.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ritikmewada/auth-service.git
cd auth-service
```

---

## 🐳 Docker Setup

### 2. Set Up PostgreSQL in Docker

Make sure [Docker](https://www.docker.com/products/docker-desktop) is installed on your machine.

#### Step-by-Step:

1. **Pull the PostgreSQL image**

    ```bash
    docker pull postgres
    ```

2. **Create a persistent volume**

    ```bash
    docker volume create mernpgdata
    ```

3. **Run the PostgreSQL container**

    ```bash
    docker run --rm \
      --name mernpg-container \
      -e POSTGRES_USER=root \
      -e POSTGRES_PASSWORD=root \
      -v mernpgdata:/var/lib/postgresql/data \
      -p 5432:5432 \
      -d postgres
    ```

4. **(Optional) Access PostgreSQL via DB client**

    - You can use tools like **DBGate**, **pgAdmin**, or **TablePlus**.
    - Connect using:

        - Host: `localhost`
        - Port: `5432`
        - Username: `root`
        - Password: `root`

---

## 🔧 Running the Auth Service in Docker

### Development Mode

Use the following command to run the `auth-service` in development:

```bash
docker run --rm -it \
  -v $(pwd):/usr/src/app \
  -v /usr/src/app/node_modules \
  --env-file $(pwd)/.env \
  -p 5501:5501 \
  -e NODE_ENV=development \
  auth-service:dev
```

Make sure your `.env` file exists and includes all necessary environment variables (e.g. DB config, JWT secrets, etc).

---

## 📦 Migrations

We use TypeORM for database migrations.

### Generate a Migration

```bash
npm run migration:generate -- src/migration/rename_tables -d src/config/data-source.ts
```

This will generate a new migration file under the `src/migration` directory.

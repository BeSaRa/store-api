# Udacity Store API

A node express server application providing restful api endpoints to manage products and user orders for an online
store.

### 1 - environment variables ```.env``` file

below is the environment variable required to make application work properly

| variable           | description                                                                                           |
|--------------------|-------------------------------------------------------------------------------------------------------|
| ENV                | to specify which environment to work you can choose only one of those values (```test``` , ```dev```) |
| POSTGRES_PASSWORD  | password of default postgres user to connect to database                                              |
| POSTGRES_HOST      | postgres db server host                                                                               |
| POSTGRES_DB        | db dev name which will connected to it while run watch                                                |
| POSTGRES_USER      | db dev username                                                                                       |
| POSTGRES_DB_TEST   | db dev name which will connected to it while run test                                                 |
| POSTGRES_USER_TEST | db test username                                                                                      |
| SALT_ROUNDS        | to be used to generate password hash based on the specified number                                    |
| PASSWORD_PEPPER    | random string used to append to the plain password to make it harder to crack                         |
| SECRET_TOKEN_KEY   | secret string used as JWT signature                                                                   |

### 2 - docker-compose

go to app root folder and open your `terminal` then run the below command to start postgres database container in detach
mode, which will make you can use the same `terminal` to exec more commands

```shell
docker-compose up -d  
```

### 3 - connect to psql database container

- to access container bash type the below command and hit `enter`
- ```shell
    docker exec -it db bash
    ```

- then login to psql with user postgres by typing the below command

-   ```shell
    psql -U postgres
    ```

### 4 - create our databases

- then create our databases, yes we need 2 database one for `dev` and other for `test` environments
- `dev` **environment database** : *note remember the database name and user because we need it later to update
  our `.env` file*
    ```shell
    CREATE USER dev_user WITH PASSWORD 'type_your_password_here';
    CREATE DATABASE dev_db;
    GRANT ALL PRIVILEGES ON DATABASE dev_db TO dev_user;
    ```

- `test` **environment database**: *note remember the database name and user because we need it later to update
  our `.env` file*
    ```shell
    CREATE USER test_user WITH PASSWORD 'type_your_password_here';
    CREATE DATABASE test_db;
    GRANT ALL PRIVILEGES ON DATABASE test_db TO test_user;
    ```

### 5 - create `.env` file in project root folder and fill the variables

- example of `.env` file, but remember you have to write your owen values like database names and users that you created
  on step #4
    ```
    ENV=dev
    POSTGRES_PASSWORD=password
    POSTGRES_HOST=127.0.0.1
    POSTGRES_DB=store
    POSTGRES_USER=app
    POSTGRES_USER_TEST=test
    POSTGRES_DB_TEST=app_test
    SALT_ROUNDS=10
    PASSWORD_PEPPER=secret-hash
    SECRET_TOKEN_KEY=token-token
  ```

### 6 - Install App dependencies

- in the project root folder open the `terminal` then run the below command
  ```shell
  yarn install 
  ```

### 7 - install `db-migrate` tool as global command

- in the same terminal run the below command, to make `db-migrate` command available global which you can access it from
  anywhere
    ```shell
    yarn global add db-migrate
    ```
- then start your migration to build database schema tables
  ```shell
  db-migrate up
  ```

### 8 - run the application `dev` mode

- You are one step away from running the Application, just type the below command and hit `enter`
  ```shell
  yarn start
  ```
- congratulations, now you can access the application on this url: `http://localhost:3000`

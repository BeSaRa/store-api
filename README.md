# Udacity Store API

A node express server application providing restful api endpoints to manage products and user orders for an online
store.

### 1 - environment variables ```.env``` file

below is the environment variable required to make application work properly

| variable         | description                                                                                           |
|------------------|-------------------------------------------------------------------------------------------------------|
| ENV              | to specify which environment to work you can choose only one of those values (```test``` , ```dev```) |
| DB_HOST          | postgres db server host                                                                               |
| DB_PORT          | db server port (used for both dev/test env)                                                           |
| DEV_DB           | dev db for dev environment                                                                            |
| DEV_USER         | dev db username                                                                                       |
| DEV_PASSWORD     | dev db user password                                                                                  |
| TEST_DB          | test db for test environment                                                                          |
| TEST_USER        | test db username                                                                                      |
| TEST_PASSWORD    | test db user password                                                                                 |
| SALT_ROUNDS      | used to specified number of salt rounds while generate hash                                           |
| PASSWORD_PEPPER  | random string used to append to the plain password to make it harder to crack                         |
| SECRET_TOKEN_KEY | secret string used as JWT signature                                                                   |

### 2 - docker-compose

go to app root folder and open your `terminal` then run the below command to start postgres database container in detach
mode, which will make you can use the same `terminal` to exec more commands

```shell
docker-compose up -d  
```

### 3 - connect to psql database container

- to access container bash type the below command and hit `enter`
  ```shell
  docker exec -it db bash
  ```

- then login to psql with user postgres by typing the below command

  ```shell
  psql -h db -U postgres
  ```
    - if the terminal asked you for password type: `password` then hit `enter`

### 4 - create our databases

- then create our databases, yes we need 2 database one for `dev` and other for `test` environments
- `dev` **environment database** : *note remember the database name and user because we need it later to update
  our `.env` file*
    ```shell
    CREATE USER dev_user WITH PASSWORD 'dev_password';
    CREATE DATABASE dev_db;
    GRANT ALL PRIVILEGES ON DATABASE dev_db TO dev_user;
    ```

- `test` **environment database**: *note remember the database name and user because we need it later to update
  our `.env` file*
    ```shell
    CREATE USER test_user WITH PASSWORD 'test_password';
    CREATE DATABASE test_db;
    GRANT ALL PRIVILEGES ON DATABASE test_db TO test_user;
    ```

### 5 - create `.env` file in project root folder and fill the variables

- example of `.env` file, but remember you have to write your owen values like database names and users that you created
  on step previous step #4

  ```shell
  ENV=dev    
  DB_HOST=localhost
  DB_PORT=5432
    
  DEV_DB=dev_db
  DEV_USER=dev_user
  DEV_PASSWORD=dev_password
    
  TEST_DB=test_db
  TEST_USER=test_user
  TEST_PASSWORD=test_password
    
  SALT_ROUNDS=10
  PASSWORD_PEPPER=secret-hash
  SECRET_TOKEN_KEY=token-token
  ```

### 6 - Install App dependencies

- in the project root folder open the `terminal` then run the below command to install yarn globally
  ```shell
  npm install yarn -g 
  ```
- then type the next command to install App dependencies
  ```shell
  yarn install 
  ```

### 7 - run migration for dev environment

- type the below command to run the database migration
    ```shell
    yarn migrate:up
    ```

### 8 - run the application `dev` mode

- You are one step away from running the Application, just type the below command and hit `enter`
  ```shell
  yarn watch
  ```
- congratulations, now you can access the application on this url: `http://localhost:3000`

### Application APIs

all below routes relative base url : `http://localhost:3000`
Note for any request need JWT we have to provide it in request header called `Authorization: Bearar <token>`

#### Products EndPoints

| Method   | Route                           | Description                                                                                                                                | Auth  | Params/Body                                                                             |
|----------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|-------|-----------------------------------------------------------------------------------------|
| `GET`    | /products                       | get all products                                                                                                                           | `No`  | ------                                                                                  |
| `POST`   | /products                       | create a new product                                                                                                                       | `yes` | body `{status: active or complete, user_id: number}`                                    |
| `GET`    | /products/{product_id}          | get product by id                                                                                                                          | `No`  | Param: `product_id` to retrieve                                                         |
| `PUT`    | /products/{product_id}          | edit product                                                                                                                               | `yes` | Param: `product_id` body : `{name:string,price:number,category:string}`                 |
| `DELETE` | /products/{product_id}          | delete product by given id                                                                                                                 | `yes` | Param: `product_id` to delete                                                           |
| `GET`    | /products/{product_id}/products | display product products                                                                                                                   | `No`  | Param: `product_id` to display it's products                                            |
| `POST`   | /products/{product_id}/products | add product to specific product                                                                                                            | `yes` | Param: `product_id` body:`{product_id:number,quantity: number}`                         |
| `GET`    | products/category/{category}    | list of products by category                                                                                                               | `No`  | Param: `category`string category name to display all product of this category if exists |
| `GET`    | products/top/{top_number}       | list of top products by given number it is dynamic provide any number you want or ignore it by default will return most popular 5 products | `No`  | Param: `top_number` number to limit the return products list                            |

#### Users EndPoints

| Method   | Route                                      | Description                                                                                                                                    | Auth  | Params/Body                                                                                                                |
|----------|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|-------|----------------------------------------------------------------------------------------------------------------------------|
| `GET`    | /users/create-default-user                 | to create a new user for testing purpose <br/> will generate user with the below credentials<br/>username: `username`<br/> password:`password` | `No`  | ------                                                                                                                     |
| `POST`   | /users/authenticate                        | to authenticate the user                                                                                                                       | `No`  | `{username:sting,password:string} `                                                                                        |
| `GET`    | /users                                     | to get all users                                                                                                                               | `yes` | ------                                                                                                                     |
| `GET`    | /users/{user_id}                           | get user by given user id                                                                                                                      | `yes` | Param:`user_id` id of the user that you want retrieve                                                                      |
| `POST`   | /users                                     | create a new user                                                                                                                              | `yes` | body:`{first_name:string,last_name:string, password:string, username:string }`                                             |
| `PUT`    | /users/{user_id}                           | Update user                                                                                                                                    | `yes` | Param: `user_id` id of user to edit   <br/> body:`{first_name:string,last_name:string, password:string, username:string }` |
| `DELETE` | /users/{user_id}                           | delete user                                                                                                                                    | `yes` | Param: `user_id` id of user to delete                                                                                      |
| `GET`    | /users/{user_id}/orders                    | retrieve all orders for user                                                                                                                   | `yes` | Param: `user_id` id of user that you want retrieve his orders                                                              |
| `GET`    | /users/{user_id}/orders/active             | retrieve active orders for user                                                                                                                | `yes` | Param: `user_id` id of user that you want retrieve his active orders                                                       |
| `GET`    | /users/{user_id}/orders/complete           | retrieve complete orders for user                                                                                                              | `yes` | Param: `user_id` id of user that you want retrieve his Complete orders                                                     |
| `GET`    | /users/{user_id}/orders/{orderId}/products | retrieve order products for given order id for user                                                                                            | `yes` | Params: `user_id` id of user, `orderId` order id to display it's products                                                  |

#### Orders EndPoints

| Method   | Route                       | Description                   | Auth  | Params/Body                                                            |
|----------|-----------------------------|-------------------------------|-------|------------------------------------------------------------------------|
| `GET`    | /orders                     | get all orders                | `No`  | ------                                                                 |
| `POST`   | /orders                     | create a new order            | `yes` | body `{status: active or complete, user_id: number}`                   |
| `GET`    | /orders/{order_id}          | get order by id               | `No`  | Param: `order_id` to retrieve                                          |
| `PUT`    | /orders/{order_id}          | edit order                    | `yes` | Param:`order_id` body: `{status: active or complete, user_id: number}` |
| `DELETE` | /orders/{order_id}          | delete order by given id      | `yes` | Param:`order_id` to delete                                             |
| `GET`    | /orders/{order_id}/products | display order products        | `No`  | Param:`order_id` to display it's products                              |
| `POST`   | /orders/{order_id}/products | add product to specific order | `yes` | Param: `order_id` body:`{product_id:number,quantity: number}`          |

## Testing

to run the unit test for the app, open your terminal on the root folder then run the below command

```shell
yarn test
```

More About database schema here in [REQUIRMENTS.md](REQUIREMENTS.md)

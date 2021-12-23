import app from "../../server";
import supertest from "supertest";
import { User } from "../../interfaces/user";
import UserStore from "../../models/userStore";
import OrderStore from "../../models/orderStore";
import { OrderStatus } from "../../enums/order-status";
import { Order } from "../../interfaces/order";
import { Product } from "../../interfaces/product";
import ProductStore from "../../models/productStore";
import objectContaining = jasmine.objectContaining;

let request = supertest(app);
const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

describe("Users Routes", () => {
  describe("Security", () => {
    it("GET /users should return Access denied, invalid token", (done) => {
      request.get("/users").expect("Access denied, invalid token", done);
    });
    it("POST /users should return Access denied, invalid token", (done) => {
      request.post("/users").expect("Access denied, invalid token", done);
    });
    it("POST /users should return Access denied, invalid token", (done) => {
      request.get("/users/1").expect("Access denied, invalid token", done);
    });
    it("POST /users should return Access denied, invalid token", (done) => {
      request.put("/users/1").expect("Access denied, invalid token", done);
    });
    it("POST /users should return Access denied, invalid token", (done) => {
      request.delete("/users/1").expect("Access denied, invalid token", done);
    });
  });

  describe("Authenticated Area", () => {
    let createdUser: User;
    let password: string = "password";
    let token: string;
    let createdUserApi: User;
    beforeAll(async () => {
      createdUser = await userStore.create({
        first_name: "ahmed",
        last_name: "mostafa",
        password: password,
        username: "admin",
      });
    });

    it("users/authenticate should return authenticated user", (done) => {
      request
        .post("/users/authenticate")
        .send({
          username: createdUser.username,
          password: password,
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          token = res.body.token;
          done();
        });
    });

    it("provide wrong credentials return 401", (done) => {
      request
        .post("/users/authenticate")
        .send({
          username: "welcome",
          password: "welcome",
        })
        .expect(401, done);
    });

    it("GET /users at least get one user", (done) => {
      request
        .get("/users")
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, response) => {
          if (err) throw err;
          expect(response.body.length).toEqual(1);
          done();
        });
    });

    it("POST /users", (done) => {
      request
        .post("/users")
        .auth(token, { type: "bearer" })
        .send({
          username: "ahmed",
          password: "password",
          first_name: "first_name",
          last_name: "last_name",
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(
            objectContaining({
              username: "ahmed",
              first_name: "first_name",
              last_name: "last_name",
            })
          );
          createdUserApi = res.body as User;
          done();
        });
    });

    it("GET /users/:id should return user by given id", (done) => {
      request
        .get("/users/" + createdUser.id)
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(objectContaining(createdUser));
          done();
        });
    });

    it("PUT /users/:id should update the user by given id", (done) => {
      request
        .put("/users/" + createdUser.id)
        .send({
          last_name: "last_name changed",
          first_name: "first name changed",
        })
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(
            objectContaining({
              last_name: "last_name changed",
              first_name: "first name changed",
            })
          );
          done();
        });
    });

    describe("user Orders", () => {
      let orders: Order[] = [];
      let products: Product[] = [];

      beforeAll(async () => {
        // add some orders for the user
        orders = orders.concat(
          await orderStore.create({
            status: OrderStatus.ACTIVE,
            user_id: createdUser.id,
          }),
          await orderStore.create({
            status: OrderStatus.ACTIVE,
            user_id: createdUser.id,
          })
        );
        // create some products
        products = products.concat(
          await productStore.create({
            name: "Product 1",
            price: 150,
            category: "tools",
          }),
          await productStore.create({
            name: "Product 2",
            price: 200,
            category: "tools",
          })
        );

        // // add one product to each order
        await Promise.all(
          orders.map(async (order, index) => {
            return await orderStore.addProductToOrder({
              product_id: products[index].id,
              order_id: order.id,
              quantity: 5 * (index + 1),
            });
          })
        );
        // update one order to make it complete
        await orderStore.update({
          id: orders[0].id,
          status: OrderStatus.COMPLETE,
        });
      });

      it("GET /users/:id/orders", (done) => {
        request
          .get("/users/:id/orders".replace(":id", createdUser.id.toString()))
          .auth(token, { type: "bearer" })
          .expect(200)
          .end((err, res) => {
            if (err) throw err;
            expect(res.body.length)
              .withContext("should have 2 orders")
              .toEqual(2);
            done();
          });
      });

      it("GET /users/:id/orders/active", (done) => {
        const url = "/users/:id/orders/active".replace(
          ":id",
          createdUser.id.toString()
        );
        request
          .get(url)
          .auth(token, { type: "bearer" })
          .expect(200)
          .end((err, res) => {
            if (err) throw err;
            expect(res.body.length)
              .withContext("should have 1 Order Active")
              .toEqual(1);
            done();
          });
      });

      it("GET /users/:id/orders/complete", (done) => {
        request
          .get(
            "/users/:id/orders/complete".replace(
              ":id",
              createdUser.id.toString()
            )
          )
          .auth(token, { type: "bearer" })
          .expect(200)
          .end((err, res) => {
            if (err) throw err;
            expect(res.body.length)
              .withContext("should have 1 Order Complete")
              .toEqual(1);
            done();
          });
      });

      it("GET /users/:id/orders/:orderId/products at will get one product inside the order", (done) => {
        const url = "/users/:id/orders/:orderId/products"
          .replace(":id", createdUser.id.toString())
          .replace(":orderId", orders[0].id.toString());
        request
          .get(url)
          .auth(token, { type: "bearer" })
          .expect(200)
          .end((err, res) => {
            if (err) throw err;
            expect(res.body.length).toEqual(1);
            done();
          });
      });

      afterAll(async () => {
        // delete all orders
        await Promise.all(
          orders.map(async (order) => {
            return await orderStore.delete(order.id);
          })
        );

        // delete all products
        await Promise.all(
          products.map(async (product) => {
            return await productStore.delete(product.id);
          })
        );
      });
    });

    it("DELETE /users/:id delete user by given id", (done) => {
      request
        .delete("/users/" + createdUserApi.id)
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(
            objectContaining({
              id: createdUserApi.id,
            })
          );
          done();
        });
    });

    afterAll(async () => {
      await userStore.delete(createdUser.id);
    });
  });
});

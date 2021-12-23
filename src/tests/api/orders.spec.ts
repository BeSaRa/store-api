import supertest from "supertest";
import app from "../../server";
import OrderStore from "../../models/orderStore";
import { Order } from "../../interfaces/order";
import { User } from "../../interfaces/user";
import UserStore from "../../models/userStore";
import { OrderStatus } from "../../enums/order-status";
import objectContaining = jasmine.objectContaining;
import { Product } from "../../interfaces/product";
import ProductStore from "../../models/productStore";

const request = supertest(app);
const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();
describe("Orders Routes", () => {
  let createdOrder: Order;
  let createdUser: User;
  let createdOrderApi: Order;
  let createdProduct: Product;
  let token: string;
  beforeAll(async () => {
    createdUser = await userStore.create({
      username: "dummy_user",
      first_name: "dummy user",
      last_name: "dummy user",
      password: "password",
    });

    createdOrder = await orderStore.create({
      user_id: createdUser.id,
      status: OrderStatus.ACTIVE,
    });

    createdProduct = await productStore.create({
      name: "Dummy Product",
      price: 100,
      category: "women",
    });
  });

  afterAll(async () => {
    await userStore.delete(createdUser.id);
    await orderStore.delete(createdOrder.id);
    await productStore.delete(createdProduct.id);
  });

  describe("protected routes", () => {
    it("GET /orders should return 401", (done) => {
      request.get("/orders").expect(401, done);
    });
    it("POST /orders should return 401", (done) => {
      request.post("/orders").expect(401, done);
    });
    it("GET /orders/:id should return 401", (done) => {
      request.get("/orders/" + createdOrder.id).expect(401, done);
    });
    it("PUT /orders/:id should return 401", (done) => {
      request.put("/orders/" + createdOrder.id).expect(401, done);
    });
    it("DELETE /orders/:id should return 401", (done) => {
      request.delete("/orders/" + createdOrder.id).expect(401, done);
    });
    it("POST /orders/:id/products should return 401", (done) => {
      request
        .post("/orders/:id/products".replace(":id", createdOrder.id.toString()))
        .expect(401, done);
    });
    it("GET /orders/:id/products should return 401", (done) => {
      request
        .get("/orders/:id/products".replace(":id", createdOrder.id.toString()))
        .expect(401, done);
    });
  });

  describe("Orders API", () => {
    beforeAll(async () => {
      await userStore
        .authenticate(createdUser.username, "password")
        .then((result) => {
          if (result) {
            token = result.token;
          }
        });
    });

    it("GET /orders  should return 1 order", (done) => {
      request
        .get("/orders")
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.length).toEqual(1);
          done();
        });
    });

    it("POST /orders should create order successfully", (done) => {
      request
        .post("/orders")
        .auth(token, { type: "bearer" })
        .send({
          user_id: createdUser.id,
          status: OrderStatus.ACTIVE,
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          createdOrderApi = res.body as Order;
          expect(res.body.id).toBeDefined();
          done();
        });
    });

    it("GET /orders/:id should get the created order", (done) => {
      request
        .get("/orders/" + createdOrderApi.id)
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(createdOrderApi);
          done();
        });
    });

    it("POST /orders/:id/products should add product to given order id", (done) => {
      request
        .post("/orders/" + createdOrderApi.id + "/products")
        .auth(token, { type: "bearer" })
        .send({
          product_id: createdProduct.id,
          quantity: 5,
        })
        .expect(200, done);
    });

    it("GET /orders/:id/products should return one product for given order id ", (done) => {
      request
        .get("/orders/" + createdOrderApi.id + "/products")
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.length).toEqual(1);
          done();
        });
    });

    it("PUT /orders/:id should update order status to complete", (done) => {
      request
        .put("/orders/" + createdOrderApi.id)
        .send({
          status: OrderStatus.COMPLETE,
          user_id: createdUser.id,
        })
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(
            objectContaining({
              status: OrderStatus.COMPLETE,
            })
          );
          done();
        });
    });

    it("DELETE /orders/:id should delete order by given order id", (done) => {
      request
        .delete("/orders/" + createdOrderApi.id)
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).not.toBeNull();
          done();
        });
    });
  });
});

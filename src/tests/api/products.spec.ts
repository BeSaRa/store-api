import ProductStore from "../../models/productStore";
import supertest from "supertest";
import app from "../../server";
import UserStore from "../../models/userStore";
import { Product } from "../../interfaces/product";
import { User } from "../../interfaces/user";
import OrderStore from "../../models/orderStore";
import { Order } from "../../interfaces/order";
import { OrderStatus } from "../../enums/order-status";
import objectContaining = jasmine.objectContaining;

const request = supertest(app);
const productStore = new ProductStore();
const userStore = new UserStore();
const orderStore = new OrderStore();

describe("Products Routes", () => {
  let createdProduct: Product;
  let createdProductApi: Product;
  let createdUser: User;
  let token: string;
  beforeAll(async () => {
    createdProduct = await productStore.create({
      name: "Product dummy",
      category: "tools",
      price: 150,
    });
    createdUser = await userStore.create({
      username: "username",
      first_name: "first_name",
      last_name: "last_name",
      password: "password",
    });
  });

  afterAll(async () => {
    await productStore.delete(createdProduct.id);
    await userStore.delete(createdUser.id);
  });

  describe("Protected routes", () => {
    it("POST /products should return 401", (done) => {
      request.post("/products").expect(401, done);
    });

    it("PUT /products/:id should return 401", (done) => {
      request.put("/products/" + createdProduct.id).expect(401, done);
    });

    it("DELETE /products/:id should return 401", (done) => {
      request.delete("/products/" + createdProduct.id).expect(401, done);
    });
  });

  fdescribe("Products API", () => {
    beforeAll(async () => {
      await userStore
        .authenticate(createdUser.username, "password")
        .then((result) => {
          if (result) {
            token = result.token;
          }
        });
    });
    it("POST /products should create product", (done) => {
      request
        .post("/products")
        .auth(token, { type: "bearer" })
        .send({
          name: "Product dummy 2",
          category: "tools",
          price: 70,
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          createdProductApi = res.body as Product;
          expect(createdProductApi.id).toBeDefined();
          done();
        });
    });

    it("GET /products/:id should get product by given id", (done) => {
      request
        .get("/products/" + createdProductApi.id)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(createdProductApi);
          done();
        });
    });

    it("PUT /products/:id should update product", (done) => {
      request
        .put("/products/" + createdProductApi.id)
        .auth(token, { type: "bearer" })
        .send({
          price: 500,
          name: "Dummy product After Update",
          category: "men",
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          createdProductApi = res.body as Product;
          expect(createdProductApi).toEqual(
            objectContaining({
              price: 500,
              name: "Dummy product After Update",
              category: "men",
            })
          );
          done();
        });
    });

    it("GET /products return list of products", (done) => {
      request
        .get("/products")
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.length).toEqual(2);
          done();
        });
    });

    it("GET /products/category/:category return list of products by given category", (done) => {
      request
        .get("/products/category/" + createdProduct.category)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.length).toEqual(1);
          done();
        });
    });

    it("DELETE /products/:id delete product by given id", (done) => {
      request
        .get("/products/" + createdProductApi.id)
        .auth(token, { type: "bearer" })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(createdProductApi.id);
          done();
        });
    });

    describe("Top Products", () => {
      let createdOrder: Order;
      beforeAll(async () => {
        createdOrder = await orderStore.create({
          user_id: createdUser.id,
          status: OrderStatus.ACTIVE,
        });
        await orderStore.addProductToOrder({
          order_id: createdOrder.id,
          product_id: createdProduct.id,
          quantity: 10,
        });
      });

      afterAll(async () => {
        await orderStore.delete(createdOrder.id);
        // no need to delete product inside order because we made the ON DELETE CASCADE
      });

      it("GET /products/top/:number should return 1 product ", (done) => {
        request
          .get("/products/top/1")
          .expect(200)
          .end((err, res) => {
            if (err) throw err;
            expect(res.body.length).toEqual(1);
            expect(res.body[0]).toEqual(
              objectContaining({ ...createdProduct, quantity: 10 })
            );
            done();
          });
      });
    });
  });
});

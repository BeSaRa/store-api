import OrderStore from "../../models/orderStore";
import { Order } from "../../interfaces/order";
import UserStore from "../../models/userStore";
import { User } from "../../interfaces/user";
import { OrderStatus } from "../../enums/order-status";
import objectContaining = jasmine.objectContaining;
import { Product } from "../../interfaces/product";
import ProductStore from "../../models/productStore";

const store = new OrderStore();
describe("Order Model", () => {
  const userStore = new UserStore();
  const productStore = new ProductStore();
  let addedOrder: Order;
  let user: User;
  beforeAll(async () => {
    user = await userStore.create({
      username: "user1",
      first_name: "ahmed",
      last_name: "mostafa",
      password: "password",
    });
  });

  afterAll(async () => {
    await userStore.delete(user.id);
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });
  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });
  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });
  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });
  it("should have an update method", () => {
    expect(store.update).toBeDefined();
  });

  it("should add Order", async () => {
    const order: Partial<Order> = {
      user_id: user.id,
      status: OrderStatus.ACTIVE,
    };
    addedOrder = await store.create(order);
    expect(addedOrder).toEqual({
      id: addedOrder.id,
      user_id: user.id,
      status: OrderStatus.ACTIVE,
    });
  });

  it("index method should get list of Orders", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: addedOrder.id,
        user_id: user.id,
        status: OrderStatus.ACTIVE,
      },
    ]);
  });

  it("show method should get Order with given id", async () => {
    const result = await store.show(addedOrder.id);
    expect(result).toEqual({
      id: addedOrder.id,
      user_id: user.id,
      status: OrderStatus.ACTIVE,
    });
  });

  it("update method should update Order", async () => {
    const result = await store.update({
      id: addedOrder.id,
      user_id: user.id,
      status: OrderStatus.COMPLETE,
    });

    expect(result).toEqual(
      objectContaining({
        id: addedOrder.id,
        user_id: user.id,
        status: OrderStatus.COMPLETE,
      })
    );
  });

  describe("Order Products", () => {
    let product: Product;
    beforeAll(async () => {
      product = await productStore.create({
        name: "Test Product",
        category: "Cat1",
        price: 200,
      });
    });

    afterAll(async () => {
      await productStore.delete(product.id);
    });

    it("add product to order", async () => {
      const result = await store.addProductToOrder({
        product_id: product.id,
        order_id: addedOrder.id,
        quantity: 10,
      });
      expect(result).toEqual(
        objectContaining({
          id: result.id,
          order_id: addedOrder.id,
          quantity: result.quantity,
          product_id: product.id,
        })
      );
    });
  });

  it("Order 1 should be exists", async () => {
    const result = await store.exists(addedOrder.id);
    expect(result).toBeTrue();
  });
});

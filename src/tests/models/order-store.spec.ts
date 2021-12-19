import OrderStore from "../../models/orderStore";
import { Order } from "../../interfaces/order";
import objectContaining = jasmine.objectContaining;
import UserStore from "../../models/userStore";
import { User } from "../../interfaces/user";

const store = new OrderStore();
describe("Order Model", () => {
  const userStore = new UserStore();
  let user: User;
  beforeAll(async () => {
    user = await userStore.create({
      id: 1,
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
      id: 1,
      user_id: user.id,
      status: false,
    };
    const result = await store.create(order);
    expect(result).toEqual({
      id: 1,
      user_id: user.id,
      status: false,
    });
  });

  it("index method should get list of Orders", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        user_id: user.id,
        status: false,
      },
    ]);
  });

  it("show method should get Order with id 1", async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      user_id: user.id,
      status: false,
    });
  });

  it("update method should update Order", async () => {
    const result = await store.update({
      id: 1,
      user_id: user.id,
      status: true,
    });

    expect(result).toEqual(
      objectContaining({
        id: 1,
        user_id: user.id,
        status: true,
      })
    );
  });

  it("Order 1 should be exists", async () => {
    const result = await store.exists(1);
    expect(result).toBeTrue();
  });
});

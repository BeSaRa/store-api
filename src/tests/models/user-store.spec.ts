import UserStore from "../../models/userStore";
import { User } from "../../interfaces/user";
import objectContaining = jasmine.objectContaining;

const store = new UserStore();
describe("User Model", () => {
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
  it("should create user", async () => {
    const user: Partial<User> = {
      id: 1,
      first_name: "ahmed",
      last_name: "mostafa",
      password: "password",
    };
    const result = await store.create(user);
    expect(result).toEqual({
      id: 1,
      first_name: "ahmed",
      last_name: "mostafa",
      password: "password",
    });
  });

  it("index method should get list of users ", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        first_name: "ahmed",
        last_name: "mostafa",
        password: "password",
      },
    ]);
  });

  it("show method should get user with id 1", async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      first_name: "ahmed",
      last_name: "mostafa",
      password: "password",
    });
  });

  it("update method should update user", async () => {
    const result = await store.update({
      id: 1,
      first_name: "John Doe",
    });

    expect(result).toEqual(
      objectContaining({
        first_name: "John Doe",
        id: 1,
      })
    );
  });

  it("user 1 should be exists", async () => {
    const result = await store.exists(1);
    expect(result).toBeTrue();
  });
});

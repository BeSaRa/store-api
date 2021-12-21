import UserStore from "../../models/userStore";
import { User } from "../../interfaces/user";
import objectContaining = jasmine.objectContaining;

const store = new UserStore();
describe("User Model", () => {
  let createdUser: User;
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
      username: "user1",
      first_name: "ahmed",
      last_name: "mostafa",
      password: "password",
    };
    createdUser = await store.create(user);
    expect(createdUser).toEqual({
      id: createdUser.id,
      username: "user1",
      first_name: "ahmed",
      last_name: "mostafa",
      password: createdUser.password,
    });
  });

  it("authenticate should return authenticated user with token if provided credentials right", async () => {
    const authenticated = await store.authenticate("user1", "password");
    expect(authenticated?.token).toBeDefined();
  });
  it("authenticate should return null if provided credentials is wrong", async () => {
    const authenticated = await store.authenticate("xyz", "blah-blah");
    expect(authenticated).toBeNull();
  });

  it("index method should get list of users ", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: createdUser.id,
        username: "user1",
        first_name: "ahmed",
        last_name: "mostafa",
        password: result[0].password,
      },
    ]);
  });

  it("show method should get user with created id", async () => {
    const result = await store.show(createdUser.id);
    expect(result).toEqual({
      id: createdUser.id,
      username: "user1",
      first_name: "ahmed",
      last_name: "mostafa",
      password: result.password,
    });
  });

  it("update method should update user", async () => {
    const result = await store.update({
      id: createdUser.id,
      first_name: "John Doe",
    });

    expect(result).toEqual(
      objectContaining({
        first_name: "John Doe",
        id: createdUser.id,
      })
    );
  });

  it("user 1 should be exists", async () => {
    const result = await store.exists(createdUser.id);
    expect(result).toBeTrue();
  });
});

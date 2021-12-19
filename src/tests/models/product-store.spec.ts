import ProductStore from "../../models/productStore";
import { Product } from "../../interfaces/product";
import objectContaining = jasmine.objectContaining;

const store = new ProductStore();

describe("Product Model", () => {
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
  it("should add Product", async () => {
    const user: Partial<Product> = {
      id: 1,
      name: "Product 1",
      price: 200,
      category: "men",
    };
    const result = await store.create(user);
    expect(result).toEqual({
      id: 1,
      name: "Product 1",
      price: 200,
      category: "men",
    });
  });

  it("index method should get list of Products", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: "Product 1",
        price: 200,
        category: "men",
      },
    ]);
  });

  it("show method should get Product with id 1", async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      name: "Product 1",
      price: 200,
      category: "men",
    });
  });

  it("update method should update Product", async () => {
    const result = await store.update({
      id: 1,
      name: "Product after update",
    });

    expect(result).toEqual(
      objectContaining({
        id: 1,
        name: "Product after update",
      })
    );
  });

  it("Product 1 should be exists", async () => {
    const result = await store.exists(1);
    expect(result).toBeTrue();
  });
});

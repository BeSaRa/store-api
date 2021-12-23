import ProductStore from "../../models/productStore";
import { Product } from "../../interfaces/product";
import objectContaining = jasmine.objectContaining;

const store = new ProductStore();

describe("Product Model", () => {
  let product: Product;

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
    product = await store.create({
      name: "Product 1",
      price: 200,
      category: "men",
    });
    expect(product).toEqual({
      id: product.id,
      name: "Product 1",
      price: 200,
      category: "men",
    });
  });

  it("index method should get list of Products", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: product.id,
        name: "Product 1",
        price: 200,
        category: "men",
      },
    ]);
  });

  it("show method should get Product with id 1", async () => {
    const result = await store.show(product.id);
    expect(result).toEqual({
      id: product.id,
      name: "Product 1",
      price: 200,
      category: "men",
    });
  });

  it("update method should update Product", async () => {
    const result = await store.update({
      id: product.id,
      name: "Product after update",
    });

    expect(result).toEqual(
      objectContaining({
        id: product.id,
        name: "Product after update",
      })
    );
  });

  describe("Check get Products by Category ", () => {
    let productList: number[] = [];
    const generateProduct = (index: number) => ({
      name: "Tool" + index,
      price: 150 * index,
      category: "tools",
    });

    const saveProduct = async (index: number) => {
      return await store.create(generateProduct(index)).then((p) => {
        productList.push(p.id);
        return p;
      });
    };

    const deleteProduct = async (id: number) => await store.delete(id);
    beforeAll(async () => {
      await saveProduct(1)
        .then(async (product) => await saveProduct(product.id))
        .then(async (product) => await saveProduct(product.id));
    });

    afterAll(async () => {
      await deleteProduct(productList[0])
        .then(async () => await deleteProduct(productList[1]))
        .then(async () => await deleteProduct(productList[2]));
    });

    it("should return 3 product for tools category", async () => {
      const result = await store.getByCategory("tools");
      expect(result.length).toEqual(3);
    });
  });

  it("Product 1 should be exists", async () => {
    const result = await store.exists(product.id);
    expect(result).toBeTrue();
  });
});

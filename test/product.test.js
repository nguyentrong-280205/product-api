require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app");
const Product = require("../src/models/product.model");

beforeAll(async () => {
  const mongoUri = "mongodb://127.0.0.1:27017/productdb_test";

  console.log("Connecting test MongoDB:", mongoUri);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  console.log("Test MongoDB connected");
}, 15000);

beforeEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await Product.deleteMany({});
    await mongoose.connection.close();
  }
}, 15000);

describe("Product CRUD API", () => {

  test("POST /api/products - Create Product", async () => {

    const response = await request(app)
      .post("/api/products")
      .send({
        pid: "P001",
        pname: "Laptop ASUS",
        price: 18000000,
        quantity: 10
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.pid).toBe("P001");

    expect(response.body.pname).toBe("Laptop ASUS");
  });


  test("GET /api/products - Get all Products", async () => {

    await Product.create({
      pid: "P001",
      pname: "Laptop ASUS",
      price: 18000000,
      quantity: 10
    });

    const response = await request(app)
      .get("/api/products");

    expect(response.statusCode).toBe(200);

    expect(response.body.length).toBe(1);
  });


  test("GET /api/products/:pid - Get Product", async () => {

    await Product.create({
      pid: "P001",
      pname: "Laptop ASUS",
      price: 18000000,
      quantity: 10
    });

    const response = await request(app)
      .get("/api/products/P001");

    expect(response.statusCode).toBe(200);

    expect(response.body.pid).toBe("P001");
  });


  test("PUT /api/products/:pid - Update Product", async () => {

    await Product.create({
      pid: "P001",
      pname: "Laptop ASUS",
      price: 18000000,
      quantity: 10
    });

    const response = await request(app)
      .put("/api/products/P001")
      .send({
        pname: "ASUS VivoBook",
        price: 20000000,
        quantity: 15
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.pname)
      .toBe("ASUS VivoBook");

    expect(response.body.quantity)
      .toBe(15);
  });


  test("DELETE /api/products/:pid - Delete Product", async () => {

    await Product.create({
      pid: "P001",
      pname: "Laptop ASUS",
      price: 18000000,
      quantity: 10
    });

    const response = await request(app)
      .delete("/api/products/P001");

    expect(response.statusCode).toBe(200);

    const product =
      await Product.findOne({ pid: "P001" });

    expect(product).toBeNull();
  });


  test("POST - Reject negative price", async () => {

    const response = await request(app)
      .post("/api/products")
      .send({
        pid: "P002",
        pname: "Invalid Product",
        price: -1000,
        quantity: 5
      });

    expect(response.statusCode).toBe(400);
  });


  test("POST - Reject duplicate pid", async () => {

    await Product.create({
      pid: "P001",
      pname: "Product 1",
      price: 1000,
      quantity: 1
    });

    const response = await request(app)
      .post("/api/products")
      .send({
        pid: "P001",
        pname: "Product 2",
        price: 2000,
        quantity: 2
      });

    expect(response.statusCode).toBe(409);
  });


  test("GET - Return 404 when product does not exist", async () => {

    const response = await request(app)
      .get("/api/products/NOTFOUND");

    expect(response.statusCode).toBe(404);
  });

});
export class NetworkIntercepting {
  constructor(dataPayload, createOrderPayload) {
    this.dataPayload = dataPayload;
    this.createOrderPayload = createOrderPayload;
  }

  async getToken() {
    const response = await fetch(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        method: "POST",
        body: JSON.stringify(this.dataPayload),
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data.token;
  }

  async createNewOrder() {
    let orderData = {};
    const responseCreateOrder = await fetch(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        method: "POST",
        body: JSON.stringify(this.createOrderPayload),
        headers: {
          "Content-type": "application/json",
          Authorization: await this.getToken(),
        },
      },
    );
    const createOrderData = await responseCreateOrder.json();
    console.log(createOrderData);
    orderData.orderId = createOrderData.orders[0];
    orderData.token = await this.getToken();
    return orderData;
  }
}

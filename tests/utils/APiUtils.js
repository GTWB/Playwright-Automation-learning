export class APiUtils {
  constructor(contextApi, dataPayload) {
    this.contextApi = contextApi;
    this.dataPayload = dataPayload;
  }

  //   Create and get Token to avoid Login eachTime
  async getToken() {
    const response = await this.contextApi.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: this.dataPayload,
      },
    );

    const data = await response.json();
    const token = data.token;
    return token;
  }

  //   Create an order
  async createOrder(createOrderPayload) {
    let response = {};
    response.token = await this.getToken();
    const orderResponse = await this.contextApi.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: createOrderPayload,
        headers: {
          authorization: response.token,
        },
      },
    );
    const orderObj = await orderResponse.json();
    response.orderId = orderObj.orders[0];
    return response;
  }
}

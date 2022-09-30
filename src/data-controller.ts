import {ReactiveController, ReactiveControllerHost} from 'lit';

export interface GiftCard {
  id: number,
  last_characters: string,
  balance: string,
  amount_used: string,
  presentment_amount_used: string,
}

export interface Discount {
  title: string,
  amount: string,
  application_type: string,
}

export interface CheckoutData {
  checkout: {
    applied_discounts: Array<Discount>,
    gift_cards: Array<GiftCard>,
    total_discount_amount: string,
    total_line_items_price: string,
    payment_due: string,
    customer_locale: string,
    presentment_currency: string,
  }
}

export class DataController implements ReactiveController {
  private host: ReactiveControllerHost;
  _token: string;
  _authorizationToken: string;
  _data: CheckoutData;
  _discounts: Array<Discount>;
  _gift_cards: Array<GiftCard>;
  _error: boolean;

  constructor(host: ReactiveControllerHost) {
    this._token = '';
    this._authorizationToken = '';
    this._data = {
      checkout: {
        applied_discounts: [] as Array<Discount>,
        gift_cards: [] as Array<GiftCard>,
        total_discount_amount: "",
        total_line_items_price: "",
        payment_due: "",
        customer_locale: "",
        presentment_currency: "",
      }
    };
    this._discounts = [];
    this._gift_cards = [];
    this._error = false;
    (this.host = host).addController(this);
  }

  private async getTokens() {
    const data = await fetch('/checkout');

    if (data.status === 409) {
      await this.getTokens();
      return;
    }

    if (!data.ok) {
      throw Error('Not ok status!');
    }

    const text = await data.text();
    const div = document.createElement('div');
    div.innerHTML = text;
    const metaSelector = "[name=shopify-checkout-authorization-token]";
    this._authorizationToken = (div.querySelector(metaSelector) as HTMLMetaElement)?.content ?? '';
    this._token = data.url.split('/').pop() as string;
  }

  async queryCheckout(method="GET", body:string|null=null) {
    let data = await fetch(`/wallets/checkouts/${this._token}`, {
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        'x-shopify-checkout-authorization-token': this._authorizationToken
      },
      body,
      method,
      mode: 'cors',
      credentials: 'omit'
    });

    if (data.status === 409) {
      data = await this.queryCheckout(method, body);
    }

    return data;
  }

  async clearDiscount(event: Event, code: string) {
    const button = event.currentTarget as HTMLButtonElement;
    button.classList.add('loading');
    console.log('%cTEST', 'color: orange; background: black; padding: 5px;', button);

    try {
      const body = JSON.stringify({ checkout: { clear_discount: 1, discount_code: code } });
      const data = await this.queryCheckout("PUT", body);

      if (!data.ok) {
        throw Error('Not ok status!');
      }

      const JsonData = await data.json();
      this._data = JsonData;

      if (JsonData?.checkout?.applied_discounts) {
        this._discounts = JsonData.checkout.applied_discounts;
      }

      if (JsonData?.checkout?.gift_cards) {
        this._gift_cards = JsonData.checkout.gift_cards;
      }

      button.classList.remove('loading');
      this.host.requestUpdate();
    } catch (error) {
      button.classList.remove('loading');
      console.log(error)
    }
  }

  async clearGiftCard(event: Event, giftCard: GiftCard) {
    const button = event.currentTarget as HTMLButtonElement;
    button.classList.add('loading');
    console.log('%cTEST', 'color: orange; background: black; padding: 5px;', button);

    try {
      const body = JSON.stringify({
        checkout: {
          applied_gift_cards: {
            [giftCard.id]: {
              id: giftCard.id,
              _delete: 1,
            }
          }
        }
      });

      const data = await this.queryCheckout("PUT", body);

      if (!data.ok) {
        throw Error('Not ok status!');
      }

      const JsonData = await data.json();
      this._data = JsonData;

      if (JsonData?.checkout?.applied_discounts) {
        this._discounts = JsonData.checkout.applied_discounts;
      }

      if (JsonData?.checkout?.gift_cards) {
        this._gift_cards = JsonData.checkout.gift_cards;
      }

      button.classList.remove('loading');
      this.host.requestUpdate();
    } catch (error) {
      button.classList.remove('loading');
      console.log(error)
    }
  }

  async applyCode(code: string) {
    const body = JSON.stringify({
      checkout: {
        reduction_code: code
      }
    });

    const data = await this.queryCheckout("PUT", body);

    if (!data.ok) {
      throw Error('Not ok status!');
    }

    const JsonData = await data.json();
    this._data = JsonData;

    if (JsonData?.checkout?.applied_discounts) {
      this._discounts = JsonData.checkout.applied_discounts;
    }

    if (JsonData?.checkout?.gift_cards) {
      this._gift_cards = JsonData.checkout.gift_cards;
    }

    this.host.requestUpdate();
  }

  private async discountQuery() {
    try {
      await this.getTokens();
      const data = await this.queryCheckout();

      if (data.status === 404) {
        throw Error('CART Empty! 404 status!');
      }

      if (!data.ok) {
        throw Error('Not ok status!');
      }

      const JsonData = await data.json();
      this._data = JsonData;

      if (JsonData?.checkout?.applied_discounts) {
        this._discounts = JsonData.checkout.applied_discounts;
      }
  
      if (JsonData?.checkout?.gift_cards) {
        this._gift_cards = JsonData.checkout.gift_cards;
      }
    } catch (error) {
      console.log(error);
      this._error = true;
    }
  }

  async hostConnected() {
    await this.discountQuery();
    this._data = {
      checkout: {
        "total_line_items_price": "500.00",
        "presentment_currency": "USD",
        "customer_locale": "en-MA",
        "payment_due": "390.00",
        "total_discount_amount": "75.00",
        "gift_cards": [
          {
            "id": 257826029641,
            "last_characters": "a87a",
            "balance": "25.00",
            "amount_used": "25.00",
            "presentment_amount_used": "25.00"
          },
          {
            "id": 257826062409,
            "last_characters": "8gff",
            "balance": "10.00",
            "amount_used": "10.00",
            "presentment_amount_used": "10.00"
          }
        ],
        "applied_discounts": [
          {
            "amount": "75.00",
            "title": "TEST1",
            "application_type": "discount_code"
          }
        ],
      }
    }
    this.host.requestUpdate();
  }
}

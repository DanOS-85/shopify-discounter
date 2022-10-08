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
  value_type: string,
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

  private getMetaUrl(text: string) {
    const div = document.createElement('div');
    div.innerHTML = text;

    const urlRegex = /(https?:\/\/[^ ]*)/;
    const metaContent = (div.querySelector('meta[http-equiv="refresh"]') as HTMLMetaElement)?.content ?? '';
    const matches = metaContent.match(urlRegex);

    if(!matches?.length) return;

    return matches[1];
  }

  private async getDataFromMetaURL(text: string) {
    const url = this.getMetaUrl(text);
    if(!url) return;

    const data = await fetch(url);

    if (data.status === 409) {
      await this.getTokens();
      return;
    }

    if (!data.ok) {
      throw Error('Query failed!');
    }

    this._token = data.url.split('/').pop() as string;
    return await data.text();
  }

  private async getTokens() {
    const data = await fetch('/checkout');

    if (data.status === 409) {
      await this.getTokens();
      return;
    }

    if (!data.ok) {
      throw Error('Query failed!');
    }

    const text = await data.text();
    const div = document.createElement('div');
    div.innerHTML = text;
    const metaSelector = "[name=shopify-checkout-authorization-token]";
    this._authorizationToken = (div.querySelector(metaSelector) as HTMLMetaElement)?.content ?? '';
    this._token = data.url.split('/').pop() as string;

    if (!this._authorizationToken) {
      const text2 = await this.getDataFromMetaURL(text);
      if(!text2) return;

      const text3 = await this.getDataFromMetaURL(text2);
      if(!text3) return;

      const div2 = document.createElement('div');
      div2.innerHTML = text3;
      this._authorizationToken = (div2.querySelector(metaSelector) as HTMLMetaElement)?.content ?? '';
    }
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

    try {
      const body = JSON.stringify({ checkout: { clear_discount: 1, discount_code: code } });
      const data = await this.queryCheckout("PUT", body);

      if (!data.ok) {
        throw Error('Operation failed!');
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
        throw Error('Operation failed!');
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
      throw Error('Operation failed!');
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
        this._error = true;
        return;
      }

      if (!data.ok) {
        throw Error('Operation failed!');
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
    }
  }

  async hostConnected() {
    await this.discountQuery();
    this.host.requestUpdate();

    window.addEventListener('cart-updated', async () => {
      await this.discountQuery();
      this.host.requestUpdate();
    });
  }
}

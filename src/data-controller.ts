import {ReactiveController, ReactiveControllerHost} from 'lit';

export interface GiftCard {
  id: number,
  last_characters: string,
  balance: string,
  amount_used: string,
  presentment_amount_used: string,
}

export interface CheckoutData {
  checkout: {
    applied_discounts: Array<{title: string}>,
    gift_cards: Array<GiftCard>,
    total_discount_amount: string
  }
}

export class DataController implements ReactiveController {
  private host: ReactiveControllerHost;
  _token: string;
  _authorizationToken: string;
  _data: CheckoutData;
  _discounts: Array<{title: string}>;
  _gift_cards: Array<GiftCard>;
  _error: boolean;

  constructor(host: ReactiveControllerHost) {
    this._token = '';
    this._authorizationToken = '';
    this._data = {
      checkout: {
        applied_discounts: [],
        gift_cards: [],
        total_discount_amount: "",
      }
    };
    this._discounts = [];
    this._gift_cards = [];
    this._error = false;
    (this.host = host).addController(this);
  }

  private async getTokens() {
    const data = await fetch('/checkout');
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

  queryCheckout(method="GET", body:string|null=null) {
    return fetch(`/wallets/checkouts/${this._token}`, {
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

      if (JsonData?.checkout?.applied_discounts) {
        this._discounts = JsonData.checkout.applied_discounts;
      }

      if (JsonData?.checkout?.gift_cards) {
        this._gift_cards = JsonData.checkout.gift_cards;
      }

      this.host.requestUpdate();
    } catch (error) {
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

      if (JsonData?.checkout?.applied_discounts) {
        this._discounts = JsonData.checkout.applied_discounts;
      }
  
      if (JsonData?.checkout?.gift_cards) {
        this._gift_cards = JsonData.checkout.gift_cards;
      }

      this._data = JsonData;
    } catch (error) {
      console.log(error);
      this._error = true;
    }
  }

  async hostConnected() {
    await this.discountQuery();
    this.host.requestUpdate();
  }
}

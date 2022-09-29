export class DataController {
    constructor(host, store) {
        (this.host = host).addController(this);
        this._store = store;
        this._token = '';
        this._authorizationToken = '';
        this._data = {
            checkout: {
                applied_discounts: [],
                gift_cards: []
            }
        };
        this._error = false;
    }
    async getTokens() {
        var _a, _b;
        const data = await fetch(`https://${this._store}/checkout`);
        const text = await data.text();
        const div = document.createElement('div');
        div.innerHTML = text;
        const metaSelector = "[name=shopify-checkout-authorization-token]";
        this._authorizationToken = (_b = (_a = div.querySelector(metaSelector)) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : '';
        this._token = data.url.split('/').pop();
    }
    queryCheckout(method = "GET", body = null) {
        return fetch(`https://${this._store}/wallets/checkouts/${this._token}`, {
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
    async discountQuery() {
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
        }
        catch (error) {
            console.log(error);
            this._error = true;
        }
    }
    async hostConnected() {
        await this.discountQuery();
        this.host.requestUpdate();
    }
}
//# sourceMappingURL=data-controler.js.map
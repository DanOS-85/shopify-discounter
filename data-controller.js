export class DataController {
    constructor(host) {
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
    async getTokens() {
        var _a, _b;
        const data = await fetch('/checkout');
        if (!data.ok) {
            throw Error('Not ok status!');
        }
        const text = await data.text();
        const div = document.createElement('div');
        div.innerHTML = text;
        const metaSelector = "[name=shopify-checkout-authorization-token]";
        this._authorizationToken = (_b = (_a = div.querySelector(metaSelector)) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : '';
        this._token = data.url.split('/').pop();
    }
    queryCheckout(method = "GET", body = null) {
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
    async clearDiscount(event, code) {
        var _a, _b;
        const button = event.currentTarget;
        button.classList.add('loading');
        console.log('%cTEST', 'color: orange; background: black; padding: 5px;', button);
        try {
            const body = JSON.stringify({ checkout: { clear_discount: 1, discount_code: code } });
            const data = await this.queryCheckout("PUT", body);
            if (!data.ok) {
                throw Error('Not ok status!');
            }
            const JsonData = await data.json();
            if ((_a = JsonData === null || JsonData === void 0 ? void 0 : JsonData.checkout) === null || _a === void 0 ? void 0 : _a.applied_discounts) {
                this._discounts = JsonData.checkout.applied_discounts;
            }
            if ((_b = JsonData === null || JsonData === void 0 ? void 0 : JsonData.checkout) === null || _b === void 0 ? void 0 : _b.gift_cards) {
                this._gift_cards = JsonData.checkout.gift_cards;
            }
            button.classList.remove('loading');
            this.host.requestUpdate();
        }
        catch (error) {
            button.classList.remove('loading');
            console.log(error);
        }
    }
    async clearGiftCard(event, giftCard) {
        var _a, _b;
        const button = event.currentTarget;
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
            if ((_a = JsonData === null || JsonData === void 0 ? void 0 : JsonData.checkout) === null || _a === void 0 ? void 0 : _a.applied_discounts) {
                this._discounts = JsonData.checkout.applied_discounts;
            }
            if ((_b = JsonData === null || JsonData === void 0 ? void 0 : JsonData.checkout) === null || _b === void 0 ? void 0 : _b.gift_cards) {
                this._gift_cards = JsonData.checkout.gift_cards;
            }
            this.host.requestUpdate();
        }
        catch (error) {
            console.log(error);
        }
    }
    async applyCode(code) {
        var _a, _b;
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
        if ((_a = JsonData === null || JsonData === void 0 ? void 0 : JsonData.checkout) === null || _a === void 0 ? void 0 : _a.applied_discounts) {
            this._discounts = JsonData.checkout.applied_discounts;
        }
        if ((_b = JsonData === null || JsonData === void 0 ? void 0 : JsonData.checkout) === null || _b === void 0 ? void 0 : _b.gift_cards) {
            this._gift_cards = JsonData.checkout.gift_cards;
        }
        this.host.requestUpdate();
    }
    async discountQuery() {
        var _a, _b;
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
            if ((_a = JsonData === null || JsonData === void 0 ? void 0 : JsonData.checkout) === null || _a === void 0 ? void 0 : _a.applied_discounts) {
                this._discounts = JsonData.checkout.applied_discounts;
            }
            if ((_b = JsonData === null || JsonData === void 0 ? void 0 : JsonData.checkout) === null || _b === void 0 ? void 0 : _b.gift_cards) {
                this._gift_cards = JsonData.checkout.gift_cards;
            }
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
//# sourceMappingURL=data-controller.js.map
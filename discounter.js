/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { CLOSE_ICON, DISCOUNT_ICON, GIFT_ICON, INFO_ICON, SPINNER_ICON } from './constants';
import { DataController } from './data-controller';
/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
let DiscounterForm = class DiscounterForm extends LitElement {
    constructor() {
        super(...arguments);
        this.hide = false;
        this.error = false;
        this.loading = false;
        this.code = '';
        this.dataFetcher = new DataController(this);
    }
    updated() {
        const detail = { data: this.dataFetcher._data };
        const event = new CustomEvent('discounter-update', { detail, bubbles: true, composed: true, cancelable: true });
        this.dispatchEvent(event);
    }
    handleInput(event) {
        var _a;
        this.error = false;
        this.code = (_a = event.target) === null || _a === void 0 ? void 0 : _a.value;
    }
    showTooltip(event) {
        const tooltip = event.currentTarget.firstElementChild;
        tooltip.style.display = "block";
    }
    hideTooltip(event) {
        const tooltip = event.currentTarget.firstElementChild;
        tooltip.style.display = "none";
    }
    async clearDiscount(event, code) {
        await this.dataFetcher.clearDiscount(event, code);
        this.code = '';
        this.error = false;
    }
    async clearGiftCard(event, giftCard) {
        await this.dataFetcher.clearGiftCard(event, giftCard);
        this.code = '';
        this.error = false;
    }
    async applyCode() {
        if (!this.code.length) {
            return;
        }
        this.loading = true;
        try {
            await this.dataFetcher.applyCode(this.code);
            this.code = '';
            this.loading = false;
        }
        catch (error) {
            this.code = '';
            this.loading = false;
            this.error = true;
            console.log(error);
        }
    }
    getDiscountsAndGifts() {
        if (this.dataFetcher._discounts.length ||
            this.dataFetcher._gift_cards.length) {
            return html `<div class="discounter-component__codes">
        ${this.dataFetcher._discounts.map((discount) => {
                const markup = discount.application_type === "automatic" ?
                    html `<div
              style="position: relative; display: flex;"
              @mouseenter=${this.showTooltip}
              @mouseleave=${this.hideTooltip}
            >
              <div class="discounter-component__tooltip" style="position: absolute; display: none;">
                Automatic discount can't be removed
              </div>
              ${INFO_ICON}
            </div>
          ` :
                    html `<button
              type="button"
              @click=${(event) => this.clearDiscount(event, discount.title)}
            >
              ${CLOSE_ICON}
              ${SPINNER_ICON}
            </button>
          `;
                return html `
            <div class="discounter-component__code">
              <span>
                ${DISCOUNT_ICON}
                <span>${discount.title.toUpperCase()}</span>
              </span>
              ${markup}
            </div>
          `;
            })}

        ${this.dataFetcher._gift_cards.map((gift_card) => {
                return html `
            <div class="discounter-component__code">
              <span>
                ${GIFT_ICON}
                <span>•••• ${gift_card.last_characters.toUpperCase()}</span>
              </span>
              <button
                type="button"
                @click=${(event) => this.clearGiftCard(event, gift_card)}
              >
                ${CLOSE_ICON}
                ${SPINNER_ICON}
              </button>
            </div>
          `;
            })}
      </div>`;
        }
        return '';
    }
    render() {
        if (this.hide) {
            return '';
        }
        const classes = this.loading ? 'button loading' : 'button';
        const errorClass = this.error ? 'error' : '';
        return html `
      <div class="discounter-component">
        <div class="discounter-component__form--wrapper">
          <div class="discounter-component__form">
            <input
              type="text"
              class=${errorClass}
              placeholder="Gift card or discount code"
              .value=${this.code}
              @input=${this.handleInput}
            >
            <button
              type="submit"
              class=${classes}
              ?disabled=${!this.code.length}
              @click=${this.applyCode}
            >
              <span>Apply</span>
              ${SPINNER_ICON}
            </button>
          </div>

          ${this.error
            ? html `<p class="discounter-component__message">Enter a valid discount code or gift card</p>`
            : ''}
        </div>

        ${this.getDiscountsAndGifts()}
      </div>
    `;
    }
};
DiscounterForm.styles = css `
    .discounter-component__form--wrapper {
      padding: 6px
    }
    .discounter-component__form {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .discounter-component__form input {
      border-radius: 5px;
      padding: 13px 11px;
    }
    .discounter-component__form input.error {
      border: 1px solid #ff6d6d;
    }
    .discounter-component__form button {
      border-radius: 5px;
      background: black;
      color: white;
      font-weight: 600;
      padding: 13px 24px;
      position: relative;
    }
    .discounter-component__form button[disabled] {
      cursor: not-allowed;
      opacity: 0.4;
    }
    .discounter-component__form button svg {
      visibility: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -10px;
      margin-left: -10px;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    }
    .discounter-component__form button.loading span {
      visibility: hidden;
    }
    .discounter-component__form button.loading svg {
      animation: rotate 0.5s linear infinite;
      visibility: visible;
      opacity: 1;
    }
    .discounter-component__message {
      color: #ff6d6d;
      font-size: 14px;
      margin: 8px 0 4px;
    }
    .discounter-component__codes {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
    }
    .discounter-component__tooltip {
      background: aliceblue;
      padding: 8px;
      border-radius: 5px;
      font-weight: 600;
      left: 50%;
      top: 50%;
      white-space: nowrap;
    }
    .discounter-component__code {
      background-color: rgba(113, 113, 113, 0.11);
      border-radius: 5px;
      color: #717171;
      display: inline-flex;
      gap: 8px;
      padding: 10px;
    }
    .discounter-component__code span {
      align-items: center;
      display: flex;
      font-size: 13px;
      font-weight: 600;
      gap: 8px;
    }
    .discounter-component .icon {
      fill: currentColor;
      height: 18px;
      width: 18px;
    }
    .discounter-component__code button {
      background: transparent;
      border: 0;
      cursor: pointer;
      padding: 0;
    }
    .discounter-component__code button .spinner_icon {
      animation: rotate 0.5s linear infinite;
    }
    .discounter-component__code button .close_icon,
    .discounter-component__code button.loading .spinner_icon {
      display: block;
    }
    .discounter-component__code button .spinner_icon,
    .discounter-component__code button.loading .close_icon {
      display: none;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
__decorate([
    state()
], DiscounterForm.prototype, "hide", void 0);
__decorate([
    state()
], DiscounterForm.prototype, "error", void 0);
__decorate([
    state()
], DiscounterForm.prototype, "loading", void 0);
__decorate([
    state()
], DiscounterForm.prototype, "code", void 0);
DiscounterForm = __decorate([
    customElement('discounter-form')
], DiscounterForm);
export { DiscounterForm };
let DiscounterSummary = class DiscounterSummary extends LitElement {
    constructor() {
        super();
        this.dataFetcher = new DataController(this);
        this.data = this.dataFetcher._data;
        window.addEventListener('discounter-update', ((event) => {
            this.data = event.detail.data;
        }));
    }
    _getDiscounts(locale, currency) {
        if (this.data.checkout.applied_discounts.length) {
            return html `
        ${this.data.checkout.applied_discounts.map(discount => {
                return html `<tr class="reduction-code">
            <th class="name" scope="row">
              <span>Discount</span>
              <span>
                ${DISCOUNT_ICON}
                <span class="text">${discount.title.toUpperCase()}</span>
              </span>
            </th>
    
            <td class="price">
              <span class="emphasis" aria-hidden="true">
                - ${this._formatMoney(locale, currency, discount.amount)}
              </span>
              <span class="visually-hidden">
                ${this._formatMoney(locale, currency, discount.amount)} off total order price
              </span>
            </td>
          </tr>`;
            })}
      `;
        }
        return '';
    }
    _getGiftCards(locale, currency) {
        if (this.data.checkout.gift_cards.length) {
            return html `
        ${this.data.checkout.gift_cards.map(giftCard => {
                return html `<tr class="reduction-code">
                <th class="name" scope="row">
                  <span>Gift card</span>
                  <span>
                    ${GIFT_ICON}
                    <span class="text">
                      <span aria-hidden="true">•••• ${giftCard.last_characters.toUpperCase()}</span>
                      <span class="visually-hidden">
                        Gift card ending with ${giftCard.last_characters.toUpperCase()}
                      </span>
                    </span>
                  </span>
                </th>

                <td class="price">
                  <span class="emphasis">
                    - ${this._formatMoney(locale, currency, giftCard.presentment_amount_used)}
                  </span>
                </td>
              </tr>`;
            })}
      `;
        }
        return '';
    }
    _formatMoney(locale, currency, amount) {
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(+amount);
    }
    render() {
        if (!this.data.checkout.total_line_items_price) {
            return '';
        }
        return html `
      <div class="discounter-summary">
        <table class="table">
          <caption class="visually-hidden">Cost summary</caption>
          <thead>
            <tr>
              <th scope="col"><span class="visually-hidden">Description</span></th>
              <th scope="col"><span class="visually-hidden">Price</span></th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr class="subtotal">
              <th class="name" scope="row">Subtotal</th>
              <td class="price">
                <span class="emphasis">
                  ${this._formatMoney(this.data.checkout.customer_locale, this.data.checkout.presentment_currency, this.data.checkout.total_line_items_price)}
                </span>
              </td>
            </tr>

            ${this._getDiscounts(this.data.checkout.customer_locale, this.data.checkout.presentment_currency)}
            ${this._getGiftCards(this.data.checkout.customer_locale, this.data.checkout.presentment_currency)}
          </tbody>
          <tfoot class="footer">
            <tr class="payment-due">
              <th class="name" scope="row">Total</th>
              <td class="price">
                <span class="currency">${this.data.checkout.presentment_currency}</span>
                <span class="emphasis">
                  ${this._formatMoney(this.data.checkout.customer_locale, this.data.checkout.presentment_currency, this.data.checkout.payment_due)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
    }
};
DiscounterSummary.styles = css `
    .visually-hidden {
      border: 0;
      clip: rect(0, 0, 0, 0);
      clip: rect(0 0 0 0);
      width: 2px;
      height: 2px;
      margin: -2px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
    }
    .discounter-summary .icon {
      fill: currentColor;
      height: 18px;
      width: 18px;
    }

    .name {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
    }

    .name span:nth-child(2) {
      margin-left: 8px;
    }

    .price {
      font-size: 14px;
      font-weight: 600;
      text-align: right;
    }

    .footer .name {
      font-size: 16px;
      font-weight: 400;
    }

    .footer .currency {
      font-size: 12px;
      font-weight: 400;
    }

    .footer .emphasis {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.04em;
      line-height: 1em;
    }

    .footer .name,
    .footer .price {
      line-height: 1.3em;
      padding-top: 3em;
      white-space: nowrap;
    }

    .footer .payment-due {
      position: relative;
    }

    .footer .payment-due::after {
      background-color: rgba(162,170,172,0.34);
      content: '';
      position: absolute;
      top: 1.5em;
      left: 0;
      width: 100%;
      height: 1px;
    }
  `;
__decorate([
    state()
], DiscounterSummary.prototype, "data", void 0);
DiscounterSummary = __decorate([
    customElement('discounter-summary')
], DiscounterSummary);
export { DiscounterSummary };
//# sourceMappingURL=discounter.js.map
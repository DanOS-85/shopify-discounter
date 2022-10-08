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
import { customElement, property, state } from 'lit/decorators.js';
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
        this.emptyMsg = false;
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
            this.loading = false;
            this.error = true;
            console.log(error);
        }
    }
    getDiscountsAndGifts() {
        if ((this.dataFetcher._discounts.length ||
            this.dataFetcher._gift_cards.length) && !this.dataFetcher._error) {
            return html `<div class="codes">
        ${this.dataFetcher._discounts.map((discount) => {
                var _a;
                const markup = discount.application_type === "automatic" ?
                    html `<div
              style="position: relative; display: flex;"
              @mouseenter=${this.showTooltip}
              @mouseleave=${this.hideTooltip}
            >
              <div class="tooltip" style="position: absolute; display: none;">
                ${((_a = window.discounter_i18n) === null || _a === void 0 ? void 0 : _a.tooltip) || "Automatic discount can't be removed"}
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
            <div class="code">
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
            <div class="code">
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
        var _a, _b, _c, _d, _e;
        if (this.dataFetcher._error && this.emptyMsg) {
            return html `<p>${((_a = window.discounter_i18n) === null || _a === void 0 ? void 0 : _a.empty_msg) || "Your cart is currently empty."}</p>`;
        }
        const classes = this.loading ? 'loading' : '';
        const errorClass = this.error ? 'error' : '';
        return html `
      <div class="discounter-form">
        <div class="form--wrapper">
          <div class="form">
            <input
              type="text"
              class=${errorClass}
              placeholder=${((_b = window.discounter_i18n) === null || _b === void 0 ? void 0 : _b.placeholder) || "Gift card or discount code"}
              .value=${this.code}
              @input=${this.handleInput}
            >
            <button
              type="submit"
              class=${classes}
              ?disabled=${this.dataFetcher._error || !this.code.length}
              @click=${this.applyCode}
            >
              <span>${((_c = window.discounter_i18n) === null || _c === void 0 ? void 0 : _c.apply) || 'Apply'}</span>
              ${SPINNER_ICON}
            </button>
          </div>

          ${this.dataFetcher._error
            ? html `<p class="message">
              ${((_d = window.discounter_i18n) === null || _d === void 0 ? void 0 : _d.empty_msg) || "Your cart is currently empty."}
            </p>`
            : ''}

          ${this.error
            ? html `<p class="message error">
              ${((_e = window.discounter_i18n) === null || _e === void 0 ? void 0 : _e.error_msg) || "Invalid discount code or gift card or invalid combination"}
            </p>`
            : ''}
        </div>

        ${this.getDiscountsAndGifts()}
      </div>
    `;
    }
};
DiscounterForm.styles = css `
    .form--wrapper {
      padding: 6px 0;
    }
    .form {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .form input {
      color: inherit;
      border-radius: 5px;
      flex: 1 1 0%;
      padding: 13px 11px;
    }
    .form input.error {
      border: 1px solid #ff6d6d;
    }
    .form button {
      border: 0;
      border-radius: 5px;
      background: var(--discounter-button-color, black);
      color: white;
      cursor: pointer;
      font-weight: 600;
      padding: 13px 24px;
      position: relative;
    }
    .form button[disabled] {
      cursor: not-allowed;
      opacity: 0.4;
    }
    .form button svg {
      visibility: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -10px;
      margin-left: -10px;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    }
    .form button.loading span {
      visibility: hidden;
    }
    .form button.loading svg {
      animation: rotate 0.5s linear infinite;
      visibility: visible;
      opacity: 1;
    }
    .message {
      font-size: 14px;
      margin: 8px 0 4px;
    }
    .message.error {
      color: #ff6d6d;
    }
    .codes {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
    }
    .tooltip {
      background: var(--discounter-tooltip-bg, white);
      color: var(--discounter-tooltip-color, black);
      padding: 8px;
      border-radius: 5px;
      font-weight: 600;
      left: 50%;
      top: 50%;
      white-space: nowrap;
    }
    .code {
      background-color: var(--discounter-code-bg, #e7f3f6);
      border-radius: 5px;
      color: var(--discounter-code-color, black);
      display: inline-flex;
      gap: 8px;
      padding: 10px;
    }
    .code span {
      align-items: center;
      display: flex;
      font-size: 13px;
      font-weight: 600;
      gap: 8px;
    }
    .icon {
      fill: currentColor;
      height: 18px;
      width: 18px;
    }
    .code button {
      background: transparent;
      border: 0;
      cursor: pointer;
      padding: 0;
    }
    .code button .spinner_icon {
      animation: rotate 0.5s linear infinite;
    }
    .code button .close_icon,
    .code button.loading .spinner_icon {
      display: block;
    }
    .code button .spinner_icon,
    .code button.loading .close_icon {
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
    property({ type: Boolean, attribute: 'empty-msg' })
], DiscounterForm.prototype, "emptyMsg", void 0);
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
                var _a, _b;
                const price = discount.value_type === "shipping" ?
                    ((_a = window.discounter_i18n) === null || _a === void 0 ? void 0 : _a.free_shipping) || 'Free shipping' :
                    `- ${this._formatMoney(locale, currency, discount.amount)}`;
                return html `<tr class="reduction-code">
            <th class="name" scope="row">
              <span>${((_b = window.discounter_i18n) === null || _b === void 0 ? void 0 : _b.discount) || "Discount"}</span>
              <span>
                ${DISCOUNT_ICON}
                <span class="text">${discount.title.toUpperCase()}</span>
              </span>
            </th>
    
            <td class="price">
              <span class="emphasis" aria-hidden="true">${price}</span>
              <span class="visually-hidden">
                ${price} of total order price
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
                var _a;
                return html `<tr class="reduction-code">
                <th class="name" scope="row">
                  <span>${((_a = window.discounter_i18n) === null || _a === void 0 ? void 0 : _a.gift_card) || "Gift card"}</span>
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (this.dataFetcher._error) {
            return '';
        }
        if (!this.data.checkout.total_line_items_price) {
            return html `
        <div class="discounter-summary">
          <table class="table">
            <caption class="visually-hidden">
              ${((_a = window.discounter_i18n) === null || _a === void 0 ? void 0 : _a.summary) || "Cost summary"}
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span class="visually-hidden">${((_b = window.discounter_i18n) === null || _b === void 0 ? void 0 : _b.description) || "Description"}</span>
                </th>
                <th scope="col">
                  <span class="visually-hidden">${((_c = window.discounter_i18n) === null || _c === void 0 ? void 0 : _c.price) || "Price"}</span>
                </th>
              </tr>
            </thead>
            <tbody class="tbody">
              <tr class="subtotal">
                <th class="name" scope="row">${((_d = window.discounter_i18n) === null || _d === void 0 ? void 0 : _d.subtotal) || "Subtotal"}</th>
                <td class="price loading"></td>
              </tr>

              <tr class="reduction-code">
                <th class="name loading" scope="row"></th>
                <td class="price loading"></td>
              </tr>
            </tbody>
            <tfoot class="footer">
              <tr class="payment-due">
                <th class="name" scope="row">${((_e = window.discounter_i18n) === null || _e === void 0 ? void 0 : _e.total) || "Total"}</th>
                <td class="price loading"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
        }
        return html `
      <div class="discounter-summary">
        <table class="table">
          <caption class="visually-hidden">
            ${((_f = window.discounter_i18n) === null || _f === void 0 ? void 0 : _f.summary) || "Cost summary"}
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span class="visually-hidden">${((_g = window.discounter_i18n) === null || _g === void 0 ? void 0 : _g.description) || "Description"}</span>
              </th>
              <th scope="col">
                <span class="visually-hidden">${((_h = window.discounter_i18n) === null || _h === void 0 ? void 0 : _h.price) || "Price"}</span>
              </th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr class="subtotal">
              <th class="name" scope="row">${((_j = window.discounter_i18n) === null || _j === void 0 ? void 0 : _j.subtotal) || "Subtotal"}</th>
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
              <th class="name" scope="row">${((_k = window.discounter_i18n) === null || _k === void 0 ? void 0 : _k.total) || "Total"}</th>
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
    table {
      width: 100%;
    }
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
    tbody tr:first-child .name {
      padding-top: 0px;
    }
    .name.loading, .price.loading {
      padding-top: 8px;
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
    .name.loading::after {
      width: 80px;
    }

    .price.loading {
      width: 80px;
    }
    .name.loading::after,
    .price.loading::after {
      animation: pulse 1s infinite;
      background-color: var(--discounter-loading-bg, #f0f0fa);
      border-radius: 3px;
      content: "";
      color: transparent;
      display: list-item;
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
      position: sticky;
    }
    .footer .payment-due::after {
      background-color: rgba(162,170,172,0.34);
      content: '';
      position: absolute;
      top: 1.2em;
      left: 0;
      width: 100%;
      height: 1px;
    }
    @keyframes pulse {
      0%, 100% {
        opacity: 1
      }
      50% {
        opacity: 0;
      }
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
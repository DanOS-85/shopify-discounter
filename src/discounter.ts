/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { CLOSE_ICON, DISCOUNT_ICON, GIFT_ICON, INFO_ICON, SPINNER_ICON } from './constants';
import { DataController, GiftCard, CheckoutData, Discount } from './data-controller';
// @ts-ignore
import { formatMoney } from '@shopify/theme-currency';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */

@customElement('discounter-form')
export class DiscounterForm extends LitElement {
  static override styles = css`
    .form--wrapper {
      padding: 6px 0;
    }
    .form {
      display: flex;
      flex-wrap: wrap;
      gap: var(--discounter-form-gap, 12px);
    }
    .form input {
      background: var(--discounter-input-bg-color, white);
      border: var(--discounter-input-border, 0);
      border-radius: var(--discounter-input-border-radius, 5px);
      color: var(--discounter-input-bg-color, inherit);
      flex: 1 1 0%;
      padding: 13px 11px;
    }
    .form input.error {
      border: 1px solid #ff6d6d;
    }
    .form button {
      border: 0;
      border-radius: var(--discounter-button-border-radius, 5px);
      background: var(--discounter-button-bg-color, black);
      color: var(--discounter-button-color, white);
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
      padding: 6px 16px;
      border-radius: var(--discounter-tooltip-border-radius, 5px);
      font-weight: 600;
      left: 50%;
      top: 50%;
      white-space: nowrap;
    }
    .code {
      background-color: var(--discounter-code-bg, #e7f3f6);
      border-radius: var(--discounter-code-border-radius, 5px);
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
      color: var(--discounter-code-color, black);
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

  @property({type: Boolean, attribute: 'empty-msg'})
  private emptyMsg = false;

  @state()
  private error = false;

  @state()
  private loading = false;

  @state()
  private code = '';

  private dataFetcher = new DataController(this);

  override updated() {
    const detail = {data: this.dataFetcher._data};
    const event = new CustomEvent('discounter-update', {detail, bubbles: true, composed: true, cancelable: true});
    this.dispatchEvent(event);
  }

  handleInput(event: InputEvent) {
    this.error = false;
    this.code = (event.target as HTMLInputElement)?.value;
  }

  showTooltip(event: MouseEvent) {
    const tooltip = (event.currentTarget as HTMLDivElement).firstElementChild as HTMLDivElement;
    tooltip.style.display = "block";
  }
  
  hideTooltip(event: MouseEvent) {
    const tooltip = (event.currentTarget as HTMLDivElement).firstElementChild as HTMLDivElement;
    tooltip.style.display = "none";
  }

  async clearDiscount(event: Event, code: string) {
    await this.dataFetcher.clearDiscount(event, code)
    this.code = '';
    this.error = false;
  }

  async clearGiftCard(event: Event, giftCard: GiftCard) {
    await this.dataFetcher.clearGiftCard(event, giftCard)
    this.code = '';
    this.error = false;
  }

  private async applyCode() {
    if (!this.code.length) {
      return;
    }

    this.loading = true;

    try {
      await this.dataFetcher.applyCode(this.code);
      this.code = '';
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.error = true;
      console.log(error);
    }
  }

  private getDiscountsAndGifts() {
    if (
      (
        this.dataFetcher._discounts.length ||
        this.dataFetcher._gift_cards.length
      ) && !this.dataFetcher._error
    ) {
      return html`<div class="codes">
        ${this.dataFetcher._discounts.map((discount: Discount) => {

          const markup = discount.application_type === "automatic" ?
          html`<div
              style="position: relative; display: flex;"
              @mouseenter=${this.showTooltip}
              @mouseleave=${this.hideTooltip}
            >
              <div class="tooltip" style="position: absolute; display: none;">
                ${window.discounter_i18n?.tooltip || "Automatic discount can't be removed"}
              </div>
              ${INFO_ICON}
            </div>
          `:
          html`<button
              type="button"
              @click=${(event: Event) => this.clearDiscount(event, discount.title)}
            >
              ${CLOSE_ICON}
              ${SPINNER_ICON}
            </button>
          `;

          return html`
            <div class="code">
              <span>
                ${DISCOUNT_ICON}
                <span>${discount.title.toUpperCase()}</span>
              </span>
              ${markup}
            </div>
          `;
        })}

        ${this.dataFetcher._gift_cards.map((gift_card: GiftCard) => {

          return html`
            <div class="code">
              <span>
                ${GIFT_ICON}
                <span>•••• ${gift_card.last_characters.toUpperCase()}</span>
              </span>
              <button
                type="button"
                @click=${(event: Event) => this.clearGiftCard(event, gift_card)}
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

  override render() {
    if (this.dataFetcher._error && this.emptyMsg) {
      return html`<p>${window.discounter_i18n?.empty_msg || "Your cart is currently empty."}</p>`;
    }

    const classes = this.loading ? 'loading': '';
    const errorClass = this.error ? 'error' : '';

    return html`
      <div class="discounter-form">
        <div class="form--wrapper">
          <div class="form">
            <input
              type="text"
              class=${errorClass}
              placeholder=${window.discounter_i18n?.placeholder || "Gift card or discount code"}
              .value=${this.code}
              @input=${this.handleInput}
            >
            <button
              type="submit"
              class=${classes}
              ?disabled=${this.dataFetcher._error || !this.code.length}
              @click=${this.applyCode}
            >
              <span>${window.discounter_i18n?.apply || 'Apply'}</span>
              ${SPINNER_ICON}
            </button>
          </div>

          ${
            this.dataFetcher._error
            ? html`<p class="message">
              ${window.discounter_i18n?.empty_msg || "Your cart is currently empty."}
            </p>`
            : ''
          }

          ${
            this.error
            ? html`<p class="message error">
              ${window.discounter_i18n?.error_msg || "Invalid discount code or gift card or invalid combination"}
            </p>`
            : ''
          }
        </div>

        ${this.getDiscountsAndGifts()}
      </div>
    `;
  }
}

@customElement('discounter-summary')
export class DiscounterSummary extends LitElement {
  static override styles = css`
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
      vertical-align: 0.2em;
      margin-right: 0.5em;
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

  constructor() {
    super();
    window.addEventListener('discounter-update', ((
      event: CustomEvent
    ) => {
      this.data = event.detail.data;
    }) as EventListener);
  }

  private _getDiscounts(moneyFormat: string) {
    if (this.data.checkout.applied_discounts.length) {
      return html`
        ${
          this.data.checkout.applied_discounts.map(discount => {
            const price = discount.value_type === "shipping" ?
              window.discounter_i18n?.free_shipping || 'Free shipping':
              `- ${formatMoney(+discount.amount * 100, moneyFormat)}`;

            return html`<tr class="reduction-code">
            <th class="name" scope="row">
              <span>${window.discounter_i18n?.discount || "Discount"}</span>
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
          })
        }
      `;
    }

    return ''
  }

  private _getGiftCards(moneyFormat: string) {
    if (this.data.checkout.gift_cards.length) {
      return html`
        ${
          this.data.checkout.gift_cards.map(giftCard => {
            return html`<tr class="reduction-code">
                <th class="name" scope="row">
                  <span>${window.discounter_i18n?.gift_card || "Gift card"}</span>
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
                    - ${formatMoney(
                        +giftCard.presentment_amount_used * 100,
                        moneyFormat
                      )}
                  </span>
                </td>
              </tr>`;
          })
        }
      `;
    }

    return ''
  }

  private dataFetcher = new DataController(this);

  @state()
  private data: CheckoutData = this.dataFetcher._data;

  override render() {
    if (this.dataFetcher._error) {
      return '';
    }

    if (!this.data.checkout.total_line_items_price) {
      return html`
        <div class="discounter-summary">
          <table class="table">
            <caption class="visually-hidden">
              ${window.discounter_i18n?.summary || "Cost summary"}
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span class="visually-hidden">${window.discounter_i18n?.description || "Description"}</span>
                </th>
                <th scope="col">
                  <span class="visually-hidden">${window.discounter_i18n?.price || "Price"}</span>
                </th>
              </tr>
            </thead>
            <tbody class="tbody">
              <tr class="subtotal">
                <th class="name" scope="row">${window.discounter_i18n?.subtotal || "Subtotal"}</th>
                <td class="price loading"></td>
              </tr>

              <tr class="reduction-code">
                <th class="name loading" scope="row"></th>
                <td class="price loading"></td>
              </tr>
            </tbody>
            <tfoot class="footer">
              <tr class="payment-due">
                <th class="name" scope="row">${window.discounter_i18n?.total || "Total"}</th>
                <td class="price loading"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    }

    return html`
      <div class="discounter-summary">
        <table class="table">
          <caption class="visually-hidden">
            ${window.discounter_i18n?.summary || "Cost summary"}
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span class="visually-hidden">${window.discounter_i18n?.description || "Description"}</span>
              </th>
              <th scope="col">
                <span class="visually-hidden">${window.discounter_i18n?.price || "Price"}</span>
              </th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr class="subtotal">
              <th class="name" scope="row">${window.discounter_i18n?.subtotal || "Subtotal"}</th>
              <td class="price">
                <span class="emphasis">
                  ${formatMoney(
                    +this.data.checkout.total_line_items_price * 100,
                    this.data.checkout.currency_format.format
                  )}
                </span>
              </td>
            </tr>

            ${this._getDiscounts(this.data.checkout.currency_format.format)}
            ${this._getGiftCards(this.data.checkout.currency_format.format)}
          </tbody>
          <tfoot class="footer">
            <tr class="payment-due">
              <th class="name" scope="row">${window.discounter_i18n?.total || "Total"}</th>
              <td class="price">
                <span class="currency">${this.data.checkout.presentment_currency}</span>
                <span class="emphasis">
                  ${formatMoney(
                    +this.data.checkout.payment_due * 100,
                    this.data.checkout.currency_format.format
                  )}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'discounter-form': DiscounterForm;
  }
  interface Window {
    discounter_i18n: {
      tooltip: string,
      empty_msg: string,
      placeholder: string,
      apply: string,
      error_msg: string,
      free_shipping: string,
      discount: string,
      gift_card: string,
      summary: string,
      description: string,
      price: string,
      subtotal: string,
      total: string
    }
  }
}

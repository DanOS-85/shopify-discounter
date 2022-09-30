/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import { CLOSE_ICON, DISCOUNT_ICON, GIFT_ICON, INFO_ICON, SPINNER_ICON } from './constants';
import { DataController, GiftCard, CheckoutData, Discount } from './data-controller';

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

  @state()
  private hide = false;

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
      this.code = '';
      this.loading = false;
      this.error = true;
      console.log(error);
    }
  }

  private getDiscountsAndGifts() {
    if (
      this.dataFetcher._discounts.length ||
      this.dataFetcher._gift_cards.length
    ) {
      return html`<div class="discounter-component__codes">
        ${this.dataFetcher._discounts.map((discount: Discount) => {

          const markup = discount.application_type === "automatic" ?
          html`<div
              style="position: relative; display: flex;"
              @mouseenter=${this.showTooltip}
              @mouseleave=${this.hideTooltip}
            >
              <div class="discounter-component__tooltip" style="position: absolute; display: none;">
                Automatic discount can't be removed
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
            <div class="discounter-component__code">
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
            <div class="discounter-component__code">
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
    if (this.hide) {
      return '';
    }

    const classes = this.loading ? 'button loading': 'button';
    const errorClass = this.error ? 'error' : '';

    return html`
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

          ${
            this.error
            ? html`<p class="discounter-component__message">Enter a valid discount code or gift card</p>`
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

  constructor() {
    super();
    window.addEventListener('discounter-update', ((
      event: CustomEvent
    ) => {
      this.data = event.detail.data;
    }) as EventListener);
  }

  private _getDiscounts(locale: string, currency: string) {
    if (this.data.checkout.applied_discounts.length) {
      return html`
        ${
          this.data.checkout.applied_discounts.map(discount => {
            return html`<tr class="reduction-code">
            <th class="name" scope="row">
              <span>Discount</span>
              <span>
                ${DISCOUNT_ICON}
                <span class="text">${discount.title.toUpperCase()}</span>
              </span>
            </th>
    
            <td class="price">
              <span class="emphasis" aria-hidden="true">
                - ${this._formatMoney(
                    locale,
                    currency,
                    discount.amount)
                  }
              </span>
              <span class="visually-hidden">
                ${this._formatMoney(
                  locale,
                  currency,
                  discount.amount)
                } off total order price
              </span>
            </td>
          </tr>`;
          })
        }
      `;
    }

    return ''
  }

  private _getGiftCards(locale: string, currency: string) {
    if (this.data.checkout.gift_cards.length) {
      return html`
        ${
          this.data.checkout.gift_cards.map(giftCard => {
            return html`<tr class="reduction-code">
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
                    - ${this._formatMoney(
                        locale,
                        currency,
                        giftCard.presentment_amount_used)
                      }
                  </span>
                </td>
              </tr>`;
          })
        }
      `;
    }

    return ''
  }

  private _formatMoney(locale: string, currency: string, amount: string) {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(+amount);
  }

  private dataFetcher = new DataController(this);

  @state()
  private data: CheckoutData = this.dataFetcher._data;

  override render() {
    if (!this.data.checkout.total_line_items_price) {
      return '';
    }

    return html`
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
                  ${this._formatMoney(
                    this.data.checkout.customer_locale,
                    this.data.checkout.presentment_currency,
                    this.data.checkout.total_line_items_price
                  )}
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
                  ${this._formatMoney(
                    this.data.checkout.customer_locale,
                    this.data.checkout.presentment_currency,
                    this.data.checkout.payment_due
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
}

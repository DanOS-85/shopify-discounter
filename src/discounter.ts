/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import { CLOSE_ICON, DISCOUNT_ICON, GIFT_ICON, SPINNER_ICON } from './constants';
import { DataController, GiftCard, CheckoutData } from './data-controller';

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
      padding: 0 24px;
      position: relative;
    }
    .discounter-component__form button.loading {
      padding: 0px 24px;
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
      margin: 8px 0 4px;
    }
    .discounter-component__codes {
      display: flex;
      gap: 10px;
      margin-top: 12px;
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
    .discounter-component__code button .icon {
      height: 16px;
      width: 16px;
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
  private data: CheckoutData = {
    checkout: {
      applied_discounts: [],
      gift_cards: [],
      total_discount_amount: "",
    }
  };

  @state()
  private hide = false;

  @state()
  private error = false;

  @state()
  private loading = false;

  @state()
  private disabled = true;

  @state()
  private code = '';

  private dataFetcher = new DataController(this);

  handleInput(event: InputEvent) {
    this.error = false;
    this.code = (event.target as HTMLInputElement)?.value;
  }

  private async applyCode() {
    if (!this.code.length) {
      return;
    }

    this.loading = true;

    try {
      await this.dataFetcher.applyCode(this.code);
      this.loading = false;
    } catch (error) {
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
        ${this.dataFetcher._discounts.map((discount: {title: string}) => {

          return html`
            <div class="discounter-component__code">
              <span>
                ${DISCOUNT_ICON}
                <span>${discount.title}</span>
              </span>
              <button
                type="button"
                @click=${(event: Event) => this.dataFetcher.clearDiscount(event, discount.title)}
              >
                ${CLOSE_ICON}
                ${SPINNER_ICON}
              </button>
            </div>
          `;
        })}

        ${this.dataFetcher._gift_cards.map((gift_card: GiftCard) => {

          return html`
            <div class="discounter-component__code">
              <span>
                ${GIFT_ICON}
                <span>•••• ${gift_card.last_characters}</span>
              </span>
              <button
                type="button"
                @click=${(event: Event) => this.dataFetcher.clearGiftCard(event, gift_card)}
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
              ?disabled=${this.disabled || !this.code.length}
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
  private dataFetcher = new DataController(this);
  override render() {
    const data = this.dataFetcher._data;

    return html`
      <div class="discounter-component">
        <h1>${data.checkout.total_discount_amount}</h1>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'discounter-form': DiscounterForm;
  }
}

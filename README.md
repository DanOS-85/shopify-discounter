# Shopify Discounter Web Component


This is making use of [Lit LitElement TypeScript starter](https://github.com/lit/lit-element-starter-ts) :tada: :fire: :heart:
### Add Shopify discounter web component in any page in your store!!!

Shopify discounter web component supports:
- Discount codes
- Automatic discounts
- Gift cards
- Discount combinations
- Multi currencies
- Internalization
- Style customization using css variables
- Place it anywhere in your store
- See Demo bellow in Testing section.

## Getting started
Download Shopify discounter script [discounter.bundled.js](https://www.meraki-apps.com/js/discounter.bundled.js).

Add the script to you Shopify assets folder, then add either code snippets below where you want the discounter to render in your store.

### Minimal setup:

```
<script src="{{ 'discounter.bundled.js' | asset_url }}" type="module"></script>
<discounter-form empty-msg></discounter-form>
<discounter-summary></discounter-summary>
```

### Full setup:

```
<script src="{{ 'discounter.bundled.js' | asset_url }}" type="module"></script>


// Theming customization using css variables
<style>
  discounter-form {
    --discounter-button-bg-color: black;
    --discounter-button-color: white;
    --discounter-tooltip-bg: purple;
    --discounter-tooltip-color: yellow;
    --discounter-code-bg: #ffc107;
    --discounter-code-color: navy;
    --discounter-form-gap: 0;
    --discounter-input-border-radius: 100px 0 0 100px;
    --discounter-button-border-radius: 0 100px 100px 0;
    --discounter-code-border-radius: 100px;
    --discounter-tooltip-border-radius: 100px;
  }

  discounter-summary {
    --discounter-loading-bg: gray;
  }
</style>


// Internalization: provide you own copy for the component
<script type="text/javascript">
  window.discounter_i18n = {};
  window.discounter_i18n = {
    tooltip: {{ 'discounter_i18n.tooltip' | t | json }},
    empty_msg: {{ 'discounter_i18n.empty_msg' | t | json }},
    placeholder: {{ 'discounter_i18n.placeholder' | t | json }},
    apply: {{ 'discounter_i18n.apply' | t | json }},
    error_msg: {{ 'discounter_i18n.error_msg' | t | json }},
    free_shipping: {{ 'discounter_i18n.free_shipping' | t | json }},
    discount: {{ 'discounter_i18n.discount' | t | json }},
    gift_card: {{ 'discounter_i18n.gift_card' | t | json }},
    summary: {{ 'discounter_i18n.summary' | t | json }},
    description: {{ 'discounter_i18n.description' | t | json }},
    price: {{ 'discounter_i18n.price' | t | json }},
    subtotal: {{ 'discounter_i18n.subtotal' | t | json }},
    total: {{ 'discounter_i18n.total' | t | json }}
  }
</script>


<discounter-form empty-msg></discounter-form>
<discounter-summary></discounter-summary>
```

### Component attributes:
discounter-form component supports just one attribute (now), it is a boolean attribute empty-msg, when your cart is empty it either shows a cart empty message if attribute is there, if not it renders a disabled form.

### Component Events:
Most stores update their cart dynamically without page reload. In this case you can dispatch 'cart-updated' event so discounter component knows that it needs to update its state too.

```
// Dispatch 'cart-updated' event after cart updated successfully.
<script>
  // Cart updated successfully
  // ...
  const event = new CustomEvent('cart-updated');
  dispatchEvent(event);
</script>
```

### Testing:
Add this [product](https://meraki-sh0p.myshopify.com/products/2018-new-women-long-dress) to cart, you'll be redirected to cart page.

In cart page there is a list of discount codes / gift cards to test with ;)

To test automatic discount, make your cart total over 1500$ and a discount will apply automatically, if there is no discounts already applied.

Hey, here is [another tool](https://www.meraki-apps.com/) that you might like.

Made with :heart: by [Youssef](https://twitter.com/usef_bh)

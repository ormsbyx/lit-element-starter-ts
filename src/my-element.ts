/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css, PropertyValues } from 'lit';
import {customElement, property } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  @property({
    type: Number,
    attribute: 'count-start',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    converter(value: any) { // converts the string from the attribute to whatever
      return value ? (value % 100) * 3 : 0;
    },
    hasChanged(newVal: number) { // only request an update if newVal is odd
      return (newVal % 2) == 1;
    }
  })
  count = 23;

  @property({ type: Object, attribute: 'extra-object' })
  extraObject: { name: String | undefined, age: Number | undefined } = {
    name: undefined,
    age: undefined
  };

  @property({ reflect: true, converter: {
    toAttribute: (value) => {
      return `chris-string-${value}`
    },
    fromAttribute: (value: string) => {
      console.log('fromAttribute:', `from-attribute-${value}`);
      return `from-attribute-${value}`;
    }
  }
  })
  thingamaJig = "asdf";

  constructor() {
    super();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).mycomp = this;
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override render() {
    setTimeout(async () => {
      await this.updateComplete;
      console.log('AFTER UPDATE COMPLETE (in render())!', this.count);
    }, 0);
    return html`
      <h1>${this.sayHello(this.name)}!</h1>
      <button @click=${this._onClick} part="button">
        Click counter! ${this.count}
      </button>
      <slot></slot>
      <div>Name: ${this.defaultName} - age: ${this.defaultAge}</div>
    `;
  }

  private get defaultName(): String {
    return this.extraObject && this.extraObject.name ? this.extraObject.name : 'Phil';
  }

  private get defaultAge(): Number {
    return this.extraObject && this.extraObject.age ? this.extraObject.age : 18;
  }

  private async _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
    try {
      await this.updateComplete;
      console.log('AFTER UPDATE COMPLETE (in _onClick())!', this.count);
    } catch (e) {
      console.log('AFTER UPDATE COMPLETE (in _onClick()) -- ERROR', e, this.count);
    }

  }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
  sayHello(name: string): string {
    return `Hello, ${name}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    console.log('should update:', _changedProperties);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override async willUpdate(_changedProperties: PropertyValues<this>) {
    // eslint-disable-next-line prefer-rest-params
    console.log('willUpdate:', _changedProperties);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override updated(_changedProperties: Map<string, any>) {
    console.log('updated:', _changedProperties);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override async update(_changedProperties: Map<string, any>) {
    console.log('update interceptor: ', _changedProperties);
    super.update(_changedProperties);
  }

  override async getUpdateComplete() {
    const result = super.getUpdateComplete();
    // do other stuff
    return result;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}

window.onunhandledrejection = function(e) {
  console.log('MY UNHANDLED EXCEPTION:', e);
}

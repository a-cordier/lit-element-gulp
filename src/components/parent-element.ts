import {LitElement, html, customElement, TemplateResult, property} from 'lit-element';

import './child-element';

@customElement('parent-element')
export class Parent extends LitElement {

    @property({ type: Object })
    private data = { name: 'Anton' };

    constructor() {
        super();
        setTimeout(() => this.data = { name: 'universe!' }, 1000)
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    protected render(): TemplateResult {
        return html`
            <child-element .data=${this.data}></child-element>
        `
    }
}
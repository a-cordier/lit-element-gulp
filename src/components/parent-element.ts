import {LitElement, html, css, customElement, property} from 'lit-element';

import './child-element';

@customElement('parent-element')
export class Parent extends LitElement {



    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    protected render() {
        return html`
            <child-element></child-element>
        `
    }

}
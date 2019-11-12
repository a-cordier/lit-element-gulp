import {LitElement, html, css, customElement, property} from 'lit-element'

import './knob-element'

const FREQUENCY_RANGE = {
    min: 60,
    max: 200
};

@customElement('child-element')
export class Child extends LitElement {
    private audioContext: AudioContext;

    @property({type: AudioParam})
    private freq: AudioParam;

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        const audioContext = new AudioContext();
        const osc = audioContext.createOscillator();
        osc.frequency.value = 60;
        osc.connect(audioContext.destination);
        osc.start();

        this.audioContext = audioContext;
        this.freq = osc.frequency;
    }

    async onKnobChange(event: CustomEvent) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume()
        }
        this.frequency = event.detail.value;
    }

    @property(({type:Number}))
    get frequency() {
        return this.freq.value;
    }

    set frequency(value) {
        this.freq.value = value;
    }

    render() {
        return html`
            <div class="knob-group">
                <knob-element 
                    value = ${this.frequency} 
                    .range = ${FREQUENCY_RANGE} 
                    step = "3"
                    @change="${this.onKnobChange}"></knob-element>
            </div>
        `
    }

    static get styles() {
        return css`
            
            knob-element {
                --knob-size: 400px;
            }
            
        `
    }

}
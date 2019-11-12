import {LitElement, html, css, customElement, property} from 'lit-element'

import './knob-element'
import './fader-element'
import './keys-element'

import {Oscillator} from "../core/osc";
import {WaveForm} from "../core/wave-forms";

@customElement('child-element')
export class Child extends LitElement {
    private audioContext: AudioContext;

    @property({type: AudioParam})
    private freq: Partial<AudioParam> = { value: 440 };

    @property({type: GainNode})
    private gain: GainNode;

    private oscs = new Map()

    @property({type: Set})
    private pressedKeys = new Set();

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.audioContext = new AudioContext();
        this.gain = this.audioContext.createGain();
        this.gain.connect(this.audioContext.destination)
    }

    async onKnobChange(event: CustomEvent) {
        console.log('knobChange', event.detail.value);
    }

    async onFaderChange(event: CustomEvent) {
        console.log('faderChange', event.detail.value);
    }

    async onKeyOn(event: CustomEvent) {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        const osc = new Oscillator(this.audioContext)
        osc.type = WaveForm.SINE;
        this.oscs.set(event.detail.midiValue, osc);
        this.gain.gain.value = this.oscs.size > 1 ? 1 / this.oscs.size : 0.5;
        osc.connect(this.gain);
        osc.frequency.value = event.detail.frequency;
        osc.start();
    }

    async onKeyOff(event: CustomEvent) {
        const midiValue = event.detail.midiValue;

        if (this.oscs.has(midiValue)) {
            this.oscs.get(midiValue).stop();
            this.oscs.delete(midiValue);
        }
    }

    render() {
        return html`
            <div class="knob-group">
                <label>
                    <knob-element 
                        @change="${this.onKnobChange}"></knob-element>
                </label>
                  
               <label>  
                    <knob-element class="smaller"
                        @change="${this.onKnobChange}"></knob-element>
               </label>       
            </div>
            <div class="fader-group">
                <fader-element @change=${this.onFaderChange}></fader-element>  
                <fader-element></fader-element>  
                <fader-element></fader-element>  
                <fader-element></fader-element>  
            </div>
            
            <div class="keys">
                <keys-element 
             
                    @keyOn=${this.onKeyOn}, 
                    @keyOff=${this.onKeyOff}></keys-element>
            </div>
        `
    }

    static get styles() {
        return css`
            
            .knob-group {
                --knob-size: 100px;

                width: 300px;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
            }

            .knob-group .smaller {
                --knob-size: 75px;
            }
            
            .fader-group {
                margin-top: 5em;
                
                width: 160px;
                
                display: flex;
                justify-content: space-evenly;

                --fader-height: 150px;
            }
            
            .keys {
                margin-top: 5em;
                
                width: 100%;

            }
            
        `
    }

}
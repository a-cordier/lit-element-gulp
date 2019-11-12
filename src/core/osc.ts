import {PulseWidthModulator} from "./pwm";
import {WaveForm} from "./wave-forms";

const SMOOTHING_TIME_CONSTANT = 0.0025;
const SMOOTHING_DELAY = 0.25;

export class Oscillator {

    private audioContext: AudioContext;
    private osc: OscillatorNode;
    private readonly output: GainNode;

    constructor(audioContext) {
        this.output = audioContext.createGain();
        this.osc = audioContext.createOscillator();
        this.osc.type = WaveForm.SINE;
        const pwm = new PulseWidthModulator(audioContext);
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.value = 960000;
        lfo.start();
        lfo.connect(lfoGain);
        lfoGain.value= -100
        lfoGain.connect(pwm.mod.gain);
        pwm.center = 12;
        this.osc.connect(pwm.input);
        pwm.connect(this.output);
        this.audioContext = audioContext;
    }

    connect(destination) {
        this.output.connect(destination);
    }

    start(time = this.audioContext.currentTime) {
        this.osc.start(time)
    }

    stop(time = this.audioContext.currentTime) {
         this.output.gain.setTargetAtTime(0, time, SMOOTHING_TIME_CONSTANT);
         this.osc.stop(time + SMOOTHING_DELAY);
    }

    get frequency() {
        return this.osc.frequency;
    }

    set type(type) {
        this.osc.type = type
    }

    get type() {
        return this.osc.type;
    }

}
const PWM_CURVE_WIDTH = 256;

function createWaveShaper(audioContext: AudioContext, curve: Float32Array): WaveShaperNode {
    const shaper = audioContext.createWaveShaper();
    shaper.curve = curve;
    return shaper;
}

function createPulseWidthModulatorWaveShaper(audioContext: AudioContext, center = 128) {
    const curve = new Float32Array(PWM_CURVE_WIDTH);

    for (let i = 0; i < center; ++i) {
        curve[i] = -1;
    }

    for (let i = center; i < PWM_CURVE_WIDTH; ++i) {
        curve[i] = 1;
    }

    return createWaveShaper(audioContext, curve);
}

function preComputePulseWidthModulatorWaveShapers(audioContext: AudioContext): WaveShaperNode[] {
    const waveShaperNodes = [];

    for (let center = 1; center < PWM_CURVE_WIDTH - 1; ++center) {
        waveShaperNodes.push(createPulseWidthModulatorWaveShaper(audioContext, center));
    }

    return waveShaperNodes;
}

function createConstantWaveShaper(audioContext: AudioContext, value = 0.5) {
    const curve = new Float32Array(2).fill(value);
    return createWaveShaper(audioContext, curve);
}

export class PulseWidthModulator {
    private readonly waveShapers: WaveShaperNode[];
    private readonly constantWaveShapper: WaveShaperNode;

    private readonly in: GainNode;
    private readonly out: GainNode;

    private readonly width: GainNode;

    private currentWaveShaper = 1;

    constructor(audioContext: AudioContext) {
        this.waveShapers = preComputePulseWidthModulatorWaveShapers(audioContext);
        this.constantWaveShapper = createConstantWaveShaper(audioContext, 0.5);
        this.out = audioContext.createGain();
        this.in = audioContext.createGain();
        this.width = audioContext.createGain();
        this.constantWaveShapper.connect(this.width);
        this.width.gain.value = 0;
        this.assemble();
    }

    private assemble() {
        const waveShaper = this.waveShapers[this.currentWaveShaper];
        this.in.connect(waveShaper);
        waveShaper.connect(this.out);
        this.width.connect(waveShaper);
        this.in.connect(this.constantWaveShapper);
    }

    set center(center: number) {
        this.currentWaveShaper = center;
        this.assemble();
    }

    get center() {
        return this.currentWaveShaper;
    }

    connect(destination) {
        this.out.connect(destination);
    }

    get input() {
        return this.in;
    }

    get mod() {
        return this.width;
    }

}
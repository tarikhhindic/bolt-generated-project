import AudioEngine from './audioEngine';

    interface Effect {
      id: string;
      name: string;
      node: AudioNode;
      parameters: { [key: string]: AudioParam };
    }

    interface Preset {
      id: string;
      name: string;
      effects: Effect[];
    }

    class EffectsSystem {
      private audioEngine: AudioEngine;
      private effects: Effect[];
      private presets: Preset[];
      private effectChain: AudioNode[];

      constructor(audioEngine: AudioEngine) {
        this.audioEngine = audioEngine;
        this.effects = [];
        this.presets = [];
        this.effectChain = [];
      }

      addEffect(effect: Effect): void {
        this.effects.push(effect);
        this.effectChain.push(effect.node);
        this.connectEffectChain();
      }

      removeEffect(effectId: string): void {
        const effectIndex = this.effects.findIndex(effect => effect.id === effectId);
        if (effectIndex !== -1) {
          this.effects.splice(effectIndex, 1);
          this.effectChain.splice(effectIndex, 1);
          this.connectEffectChain();
        }
      }

      connectEffectChain(): void {
        let previousNode = this.audioEngine.getGainNode();
        this.effectChain.forEach(effectNode => {
          previousNode.disconnect();
          previousNode.connect(effectNode);
          previousNode = effectNode;
        });
        previousNode.connect(this.audioEngine.getAnalyser());
      }

      addPreset(preset: Preset): void {
        this.presets.push(preset);
      }

      applyPreset(presetId: string): void {
        const preset = this.presets.find(p => p.id === presetId);
        if (preset) {
          this.effects = preset.effects;
          this.effectChain = this.effects.map(effect => effect.node);
          this.connectEffectChain();
        }
      }

      getEffects(): Effect[] {
        return this.effects;
      }

      getPresets(): Preset[] {
        return this.presets;
      }

      setParameter(effectId: string, parameterName: string, value: number): void {
        const effect = this.effects.find(effect => effect.id === effectId);
        if (effect && effect.parameters[parameterName]) {
          effect.parameters[parameterName].setValueAtTime(value, this.audioEngine.getAudioContext().currentTime);
        }
      }
    }

    export default EffectsSystem;

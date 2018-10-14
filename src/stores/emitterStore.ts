import _set from 'lodash/set';
import { action, computed, observable, toJS } from 'mobx';
import { shapesJSON, shapesImage } from '../constants';
import {
  DEFAULT_DEBUG_MODES,
  emitterConfig as emitterInitialConfig,
  EMITTER_NAME_PREFIX,
} from '../constants';
import { deepCopy, getNewEmitterID, hasBoth, hasKey } from '../utils';
import _isPlainObject from 'lodash/isPlainObject';
import _cloneDeep from 'lodash/cloneDeep';

export class EmitterStore {
  @observable
  emitterDefaultProps = emitterInitialConfig;

  @observable
  frame = {
    image: {
      name: 'shapes.png',
      data: shapesImage,
    },
    json: {
      name: 'shapes.json',
      data: shapesJSON,
    },
  };

  @computed
  get frames() {
    const keys: string[] = this.getFrameJSONKeys();
    const frames: any[] = keys.reduce(
      (acc: any[], value: any) => {
        acc.push({
          text: value,
          value,
        });
        return acc;
      },
      [] as any,
    );
    return frames;
  }

  @observable
  emitters = [
    {
      id: 1,
      name: `${EMITTER_NAME_PREFIX}1`,
      config: _cloneDeep(this.emitterDefaultProps),
      debugModes: { ...DEFAULT_DEBUG_MODES },
    },
  ];

  getFrameJSONKeys() {
    const frameList = this.getJSONFrames();
    let keys: any[];
    if (Array.isArray(frameList)) {
      keys = frameList.reduce(
        (acc: any[], value: any) => {
          acc.push(value.filename);
          return acc;
        },
        [] as any,
      );
    } else {
      keys = Object.keys(frameList);
    }
    return keys;
  }

  getJSONFrames() {
    const dataJSON: any = toJS(this.frame.json.data);
    return this.getJSONFramesTile(dataJSON);
  }

  getJSONFramesTile(data: any) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = data[key];
      if (key === 'frames') {
        return value;
      } else {
        if (typeof value === 'object' && typeof value !== null) {
          const returnValue: any = this.getJSONFramesTile(value);
          if (returnValue) {
            return returnValue;
          }
        }
      }
    }
  }

  changeDefautDataFrame() {
    const keys: string[] = this.getFrameJSONKeys();
    this.emitterDefaultProps.frame.frames = [keys[0]];
    if (this.emitters[0].config.frame.frames[0] === '-') {
      this.emitters[0].config.frame.frames = [keys[0]];
    }
  }

  @action.bound
  changeDebugMode(configName: string, checked: boolean) {
    this.currentEmitter.debugModes[configName] = checked;
  }

  @computed
  get currentEmitter() {
    return this.emitters[this.emitterIndex];
  }

  @computed
  get currentEmitterConfig() {
    return this.currentEmitter.config;
  }

  @observable
  lastEmitters: any[];

  @observable
  emitterIndex = 0;

  @action.bound
  setFrameImage(image: any) {
    if (/\.(png)$/i.test(image.name)) {
      this.loadFrameImage(image);
    }
  }

  @action.bound
  setFrameJSON(json: any) {
    if (/\.(json)$/i.test(json.name)) {
      this.loadFrameJSON(json);
    }
  }

  loadFrameImage(image: any) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e: any) => {
      const result = e.target.result;
      this.frame.image.name = image.name;
      this.frame.image.data = result;
    };
  }

  loadFrameJSON(json: any) {
    const reader = new FileReader();
    reader.readAsText(json);
    reader.onload = (e: any) => {
      const result = JSON.parse(e.target.result);
      this.frame.json.name = json.name;
      this.frame.json.data = result;
    };
  }

  @action.bound
  changeEmitterConfig(configName: string, value: any, index?: number) {
    const emitter =
      index !== undefined ? this.emitters[index] : this.currentEmitter;
    _set(emitter.config, configName.split('>'), value);
  }

  @action.bound
  changePropertyType(configName: string) {
    const currentValue = this.currentEmitter.config[configName];
    const initialValue = this.emitterDefaultProps[configName];
    const isObjectInitValue = _isPlainObject(initialValue);
    const isObjectCurrentValue = _isPlainObject(currentValue);

    let newConfig;
    if (isObjectCurrentValue) {
      newConfig = isObjectInitValue ? [0] : initialValue;
    } else {
      newConfig = isObjectInitValue
        ? initialValue
        : { start: 0, end: 0, ease: 'Linear' };
    }
    this.changeEmitterConfig(configName, newConfig);
  }

  @action.bound
  toggleRandom(configName: string) {
    const currentValue = this.currentEmitter.config[configName];
    const newConfig = { ...currentValue };

    if (hasBoth(currentValue, 'min', 'max')) {
      const [start, end] = [newConfig.min, newConfig.max];
      newConfig.start = start;
      newConfig.end = end;
      delete newConfig.min;
      delete newConfig.max;
    } else {
      const [min, max] = [newConfig.start, newConfig.end];
      newConfig.min = min;
      newConfig.max = max;
      delete newConfig.start;
      delete newConfig.end;
    }
    this.changeEmitterConfig(configName, newConfig);
  }

  @action.bound
  changeSelectDropdown(configName: string, value: any) {
    if (value === 'Custom') {
      this.toggleSteps(configName);
    } else {
      this.toggleSteps(configName, true);
      this.changeEmitterConfig(`${configName}>ease`, value);
    }
  }

  toggleSteps(configName: string, hide: boolean = false) {
    const initialValue = this.emitterDefaultProps[configName];
    const currentValue = this.currentEmitter.config[configName];
    const newConfig = { ...currentValue };

    if (hide) {
      delete newConfig.steps;
      newConfig.ease = hasKey(initialValue, 'ease')
        ? initialValue.ease
        : 'Linear';
    } else {
      delete newConfig.ease;
      newConfig.steps = hasKey(initialValue, 'steps') ? initialValue.steps : 10;
    }
    this.changeEmitterConfig(configName, newConfig);
  }

  // emitter position
  @action.bound
  setEmitterPosition(x: number, y: number) {
    this.changeEmitterConfig('x', [parseInt(x as any, 10)]);
    this.changeEmitterConfig('y', [parseInt(y as any, 10)]);
  }

  @action.bound
  removeEmitter(index: number) {
    this.emitters.splice(index, 1);
    const currentEmitterIndex = index === 0 ? index : index - 1;
    this.changeEmitterIndex(currentEmitterIndex);
  }

  @action.bound
  addEmitter(emitterConfig?: any, prevDebugModes?: any) {
    const id = getNewEmitterID(this.emitters);
    const name = `${EMITTER_NAME_PREFIX}${id}`;
    const config = emitterConfig ? emitterConfig : this.emitterDefaultProps;
    const debugModes = prevDebugModes
      ? { ...prevDebugModes }
      : { ...DEFAULT_DEBUG_MODES };
    this.emitters.push({ id, name, config, debugModes });
    this.setEmitterIndex(this.emitters.length - 1);
  }

  @action.bound
  copyEmitter(index: number) {
    const { config, debugModes } = this.emitters[index];
    this.addEmitter(deepCopy(config), debugModes);
  }

  @action.bound
  changeEmitterIndex(index: number) {
    this.emitterIndex = index;
  }

  @action.bound
  setEmitters(emitters: any) {
    this.emitters = emitters;
    this.setEmitterIndex(0);
  }

  @action.bound
  setFramesProp(atlas: any) {
    this.frame.image.data = atlas.data;
    this.frame.json.data = atlas.json;
  }

  setEmitterIndex(index: number) {
    this.emitterIndex = index;
  }
}

export interface EmitterStoreProp {
  emitterStore?: EmitterStore;
}

export default new EmitterStore();

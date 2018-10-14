import emitterStore from '../../stores/emitterStore';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  create() {
    emitterStore.changeDefautDataFrame();
    const dataJSON: any = emitterStore.frame.json.data;
    const dataImage: any = emitterStore.frame.image.data;
    const imageFile: any = new Image();
    imageFile.src = dataImage;
    imageFile.addEventListener('load', () => {
      this.textures.addAtlas('shape', imageFile, dataJSON);
      this.start();
    });
  }

  start() {
    this.scene.start('Background');
    this.scene.start('Canvas');
    this.scene.remove(this);
  }
}

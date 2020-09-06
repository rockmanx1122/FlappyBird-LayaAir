export default class BackGround extends Laya.Script {

    public baseTexture1: Laya.Sprite;
    public baseTexture2: Laya.Sprite;

    public backGroundTexture1: Laya.Sprite;
    public backGroundTexture2: Laya.Sprite;

    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }

    onEnable(): void {
        this.baseTexture1 = this.owner.getChildByName("base1") as Laya.Sprite;
        this.backGroundTexture1 = this.owner.getChildByName("backGround1") as Laya.Sprite;

        this.baseTexture2 = this.owner.getChildByName("base2") as Laya.Sprite;
        this.backGroundTexture2 = this.owner.getChildByName("backGround2") as Laya.Sprite;
    }

    startBackGroundLoop(): void {
        this.owner.frameLoop(1, this, this.backGroundLoop);
    }

    backGroundLoop(): void {
        //this.baseTexture1.x = -0.1;

        this.backGroundTexture1.x -= 0.15;

        this.backGroundTexture2.x -= 0.15;

        if (this.backGroundTexture1.x <= -this.backGroundTexture1.width)
            this.backGroundTexture1.x = this.backGroundTexture2.x + this.backGroundTexture2.width;
        else if (this.backGroundTexture2.x <= -this.backGroundTexture2.width)
            this.backGroundTexture2.x = this.backGroundTexture1.x + this.backGroundTexture1.width;

    }


    onDisable(): void {
    }
}
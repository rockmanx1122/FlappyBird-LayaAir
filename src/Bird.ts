export default class Bird extends Laya.Script {
    public birdAni: Laya.Animation;

    public birdRigi: Laya.RigidBody;
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() {
        super();
    }

    onEnable(): void {
        this.birdAni = this.owner.getChildByName("BirdFly") as Laya.Animation;
        this.birdRigi = this.owner.getComponent(Laya.RigidBody);
    }

    public playAnimation(): void {
        this.birdAni.play();
        this.birdAni.loop = true;
    }

    public flyHigh(): void {
        this.birdRigi.setVelocity({ x: 0, y: -1 });
        this.birdRigi.setAngle(25);
    }

    onTriggerEnter(other: any, self: any, contact: any): void {
        if (other.owner.name == "pipeDown" || other.owner.name == "pipeUp" || other.owner.name == "base1" || other.owner.name == "base2")
            Laya.stage.event("GameOver");
    }

    onDisable(): void {
    }
}
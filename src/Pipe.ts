import Bird from "./Bird";
import GameConfig from "./GameConfig";

export default class Pipe extends Laya.Script {

    /** @prop {name:boolType, tips:"布尔类型示例", type:Bool, default:true}*/
    public boolType: boolean = true;
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    public pipeUp:Laya.Sprite;

    public pipeDown:Laya.Sprite;
    
    constructor() { super(); }
    
    onEnable(): void {
        this.pipeDown=this.owner.getChildByName("pipeDown") as Laya.Sprite;

        this.pipeUp=this.owner.getChildByName("pipeUp") as Laya.Sprite;
    }


    public setPipeLeght():void{
        let random:number=Math.floor(Math.random()*(70 + 1 - 10) + 10);

        this.pipeDown.y-=random;

        this.pipeUp.y+=random;

        this.owner.frameLoop(1,this,this.pipesLoop);
    }

    pipesLoop(): void {
       this.pipeDown.x -= 0.2;

        this.pipeUp.x -= 0.2;

    }



    onDisable(): void {
    }
}

import Bird from "./Bird";
import BackGround from "./BackGround";
import Pipe from "./Pipe";

export default class GameControler extends Laya.Script {

    /** @prop {name:birdPrefab, type:Prefab}*/
    public birdPrefab: Laya.Prefab;


    /** @prop {name:pipePrefab2, type:Prefab}*/
    public pipePrefab2: Laya.Prefab;

    private _startGame: boolean = false;

    private _startBackGround: Laya.Sprite;

    private _gameOverSprite:Laya.Sprite;

    private _birdPlayer: Bird;

    private _backGround: BackGround;

    private _pipes: Pipe;

    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() {
        super();

        //Laya.init(480, 852, Laya.HTMLCanvas);
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignH = "center";
        //Laya.stage.screenMode = "vertical";

        //Laya.stage.s

    }

    onEnable(): void {
        this._startBackGround = this.owner.getChildByName("startBackGround") as Laya.Sprite;
        this._gameOverSprite=this.owner.getChildByName("GameOver") as Laya.Sprite;

        this._backGround = this.owner.getChildByName("BackGround").getComponent(BackGround);

        this._startBackGround.visible = true;
        this._gameOverSprite.visible=false;

        this._startBackGround.on(Laya.Event.CLICK, this, this.OnClickStartGame);

        Laya.stage.on("GameOver",this,this.onGameOver);

        Laya.stage.on("RestartGame",this,this.onRestGame);
    }

    OnClickStartGame(): void {
        this._startBackGround.visible = false;


        this.onCreatBird();

        this._backGround.owner.frameLoop(2000,this,this.onCreatPipe);
        //this.onCreatPipe();
        this._birdPlayer.playAnimation();
        this._backGround.startBackGroundLoop();
        this._startGame = true;
    }

    onCreatBird(): void {
        let bird = Laya.stage.addChild(Laya.Pool.getItemByCreateFun("Bird", this.birdPrefab.create, this.birdPrefab));
        this._birdPlayer = bird.getComponent(Bird);
    }

    onCreatPipe(): void {
        let pipes = this._backGround.owner.getChildByName("pipes").addChild(Laya.Pool.getItemByCreateFun("Pipe", this.pipePrefab2.create, this.pipePrefab2));

        this._pipes = pipes.getComponent(Pipe);
        this._pipes.setPipeLeght();
    }

    onStageClick(): void {
        if (this._startGame == true)
            this._birdPlayer.flyHigh();

        else if(this._startGame == false&& this._gameOverSprite.visible==true)
         Laya.stage.event("RestartGame");
    }
    onGameOver():void{
        this._startGame=false;
        this._gameOverSprite.visible=true;
    }
    onRestGame():void{
        Laya.stage.removeChild(this._birdPlayer.owner);
        this._backGround.owner.getChildByName("pipes").removeChildren(0,this._backGround.owner.getChildByName("pipes").numChildren-1);

        this._gameOverSprite.visible=false;
        this._startBackGround.visible=true;

        Laya.timer.clear(this,this.onCreatPipe);
    }
    onDisable(): void {
    }
}
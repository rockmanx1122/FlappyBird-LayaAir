(function () {
    'use strict';

    class BackGround extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.baseTexture1 = this.owner.getChildByName("base1");
            this.backGroundTexture1 = this.owner.getChildByName("backGround1");
            this.baseTexture2 = this.owner.getChildByName("base2");
            this.backGroundTexture2 = this.owner.getChildByName("backGround2");
        }
        startBackGroundLoop() {
            this.owner.frameLoop(1, this, this.backGroundLoop);
        }
        backGroundLoop() {
            this.backGroundTexture1.x -= 0.15;
            this.backGroundTexture2.x -= 0.15;
            if (this.backGroundTexture1.x <= -this.backGroundTexture1.width)
                this.backGroundTexture1.x = this.backGroundTexture2.x + this.backGroundTexture2.width;
            else if (this.backGroundTexture2.x <= -this.backGroundTexture2.width)
                this.backGroundTexture2.x = this.backGroundTexture1.x + this.backGroundTexture1.width;
        }
        onDisable() {
        }
    }

    class Bird extends Laya.Script {
        constructor() {
            super();
        }
        onEnable() {
            this.birdAni = this.owner.getChildByName("BirdFly");
            this.birdRigi = this.owner.getComponent(Laya.RigidBody);
        }
        playAnimation() {
            this.birdAni.play();
            this.birdAni.loop = true;
        }
        flyHigh() {
            this.birdRigi.setVelocity({ x: 0, y: -1 });
            this.birdRigi.setAngle(25);
        }
        onTriggerEnter(other, self, contact) {
            if (other.owner.name == "pipeDown" || other.owner.name == "pipeUp" || other.owner.name == "base1" || other.owner.name == "base2")
                Laya.stage.event("GameOver");
        }
        onDisable() {
        }
    }

    class Pipe extends Laya.Script {
        constructor() {
            super();
            this.boolType = true;
        }
        onEnable() {
            this.pipeDown = this.owner.getChildByName("pipeDown");
            this.pipeUp = this.owner.getChildByName("pipeUp");
        }
        setPipeLeght() {
            let random = Math.floor(Math.random() * (70 + 1 - 10) + 10);
            this.pipeDown.y -= random;
            this.pipeUp.y += random;
            this.owner.frameLoop(1, this, this.pipesLoop);
        }
        pipesLoop() {
            this.pipeDown.x -= 0.2;
            this.pipeUp.x -= 0.2;
        }
        onDisable() {
        }
    }

    class GameControler extends Laya.Script {
        constructor() {
            super();
            this._startGame = false;
            Laya.stage.scaleMode = "showall";
            Laya.stage.alignH = "center";
        }
        onEnable() {
            this._startBackGround = this.owner.getChildByName("startBackGround");
            this._gameOverSprite = this.owner.getChildByName("GameOver");
            this._backGround = this.owner.getChildByName("BackGround").getComponent(BackGround);
            this._startBackGround.visible = true;
            this._gameOverSprite.visible = false;
            this._startBackGround.on(Laya.Event.CLICK, this, this.OnClickStartGame);
            Laya.stage.on("GameOver", this, this.onGameOver);
            Laya.stage.on("RestartGame", this, this.onRestGame);
        }
        OnClickStartGame() {
            this._startBackGround.visible = false;
            this.onCreatBird();
            this._backGround.owner.frameLoop(2000, this, this.onCreatPipe);
            this._birdPlayer.playAnimation();
            this._backGround.startBackGroundLoop();
            this._startGame = true;
        }
        onCreatBird() {
            let bird = Laya.stage.addChild(Laya.Pool.getItemByCreateFun("Bird", this.birdPrefab.create, this.birdPrefab));
            this._birdPlayer = bird.getComponent(Bird);
        }
        onCreatPipe() {
            let pipes = this._backGround.owner.getChildByName("pipes").addChild(Laya.Pool.getItemByCreateFun("Pipe", this.pipePrefab2.create, this.pipePrefab2));
            this._pipes = pipes.getComponent(Pipe);
            this._pipes.setPipeLeght();
        }
        onStageClick() {
            if (this._startGame == true)
                this._birdPlayer.flyHigh();
            else if (this._startGame == false && this._gameOverSprite.visible == true)
                Laya.stage.event("RestartGame");
        }
        onGameOver() {
            this._startGame = false;
            this._gameOverSprite.visible = true;
        }
        onRestGame() {
            Laya.stage.removeChild(this._birdPlayer.owner);
            this._backGround.owner.getChildByName("pipes").removeChildren(0, this._backGround.owner.getChildByName("pipes").numChildren - 1);
            this._gameOverSprite.visible = false;
            this._startBackGround.visible = true;
            Laya.timer.clear(this, this.onCreatPipe);
        }
        onDisable() {
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("BackGround.ts", BackGround);
            reg("GameControler.ts", GameControler);
            reg("Bird.ts", Bird);
            reg("Pipe.ts", Pipe);
        }
    }
    GameConfig.width = 480;
    GameConfig.height = 852;
    GameConfig.scaleMode = "noscale";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "center";
    GameConfig.startScene = "GameStage.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());

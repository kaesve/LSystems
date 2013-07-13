/// <reference path="typing/angularjs/angular.d.ts" />
/// <reference path="LSystem.ts" />
/// <reference path="Turtle.ts" />

var lSystemBuilder = angular.module("lSystemBuilder", []);

lSystemBuilder.config(($routeProvider) => {
    $routeProvider.when('/', {
        templateUrl: 'lsystem-builder.html',
        controller: 'LSystemBuilderController'
    });

    $routeProvider.otherwise('/');
});

class LSystemBuilderController
{
    public lSystem: LSystems.System;
    public results: string[] = [];
    public result: string = "test";

    constructor ($rootScope)
    {
        this.lSystem = new LSystems.System("F", [
            new LSystems.ProductionRule("F", "G-F-G"),
            new LSystems.ProductionRule("G", "F+G+F"),
            new LSystems.ProductionRule("+", "+"),
            new LSystems.ProductionRule("-", "-")
        ]);

        $rootScope.initDraw = (data: string): void => {
            $rootScope.$emit("draw", data);
        };

    }

    public addRule(): void {
        console.log("adding new rule.. ");
        this.lSystem.rules.push(new LSystems.ProductionRule());
    }

    public run(): void {
        this.lSystem.rewrite();
    }
}

interface DrawInstruction {
    symbol: string;
    instruction: string;
}

class LSystemDrawController
{
    public instructionMap: {};

    public instructions: DrawInstruction[] = [
        { symbol: "F", instruction: "FORWARD 1" },
        { symbol: "G", instruction: "FORWARD 1" },
        { symbol: "+", instruction: "ROTATE 60" },
        { symbol: "-", instruction: "ROTATE -60" }
    ];

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private turtle: TurtleGraphics.Turtle;

    private lastDrawn: string = "";

    public xOffset: number = 0;
    public yOffset: number = 0;
    public zoomLevel: number = 10;

    constructor ($rootScope, $scope) {
        $rootScope.$on("draw", (e, data: string) => {
            this.draw(data);
        });

        this.canvas = <HTMLCanvasElement>document.getElementById('turtle-target');
        this.context = this.canvas.getContext('2d');
        this.turtle = new TurtleGraphics.Turtle(this.context);

        this.resizeCanvas();
        var resizeTimeoutHandle;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeoutHandle);
            resizeTimeoutHandle = setTimeout(() => {
                this.resizeCanvas();
                this.draw(this.lastDrawn);
            }, 50);
        });
    }

    public addDrawInstruction() {
        this.instructions.push({
            symbol: "",
            instruction: ""
        });
    }

    public draw(data: string): void {
        this.lastDrawn = data;
        if (data.length == 0) {
            return;
        }

        this.prepareDrawInstructions();

        this.prepareCanvas();

        this.turtle.putPenDown();

        var cachedLength = data.length;
        for (var i: number = 0; i < cachedLength; i++) {
            var key = data[i];
            if (key in this.instructionMap)
                this.instructionMap[key]();
        }

        this.turtle.putPenUp();
    }

    public zoomOut() {
        this.zoomLevel /= 2.0;
        this.draw(this.lastDrawn);
    }

    public zoomIn() {
        this.zoomLevel *= 2.0;
        this.draw(this.lastDrawn);
    }

    public resizeCanvas() {
        var parent = this.canvas.parentNode;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
    }

    private prepareCanvas() {
        var ctx = this.context;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1 / this.zoomLevel;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.translate(
            this.canvas.width / 2.0,
            this.canvas.height / 2.0
        );

        ctx.scale(this.zoomLevel, this.zoomLevel);
        ctx.translate(
            this.xOffset,
            this.yOffset
        );
    }

    private prepareDrawInstructions() {
        this.instructionMap = {};
        var sym: string;
        var ins: string;
        var possibleInstructions: TurtleGraphics.TurtleInstruction[] = TurtleGraphics.Turtle.possibleInstructions;
        var instruction: () => void;

        for (var i: number = 0; i < this.instructions.length; i++)
        {
            sym = this.instructions[i].symbol;
            ins = this.instructions[i].instruction;

            for (var ii = 0; ii < possibleInstructions.length; ii++)
            {
                instruction = possibleInstructions[ii].build(ins, this.turtle);

                if (instruction !== null) {
                    this.instructionMap[sym] = instruction;
                    break;
                }
            }
        }
    }
}


lSystemBuilder.controller('LSystemBuilderController', LSystemBuilderController);
lSystemBuilder.controller('LSystemDrawController', LSystemDrawController);
// lSystemBuilder.directive('turtlegraphics',  );
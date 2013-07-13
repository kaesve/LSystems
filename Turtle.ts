module TurtleGraphics {
    export class TurtleInstruction
    {
        constructor (private instructionTemplate: RegExp,
                     private instructionBuilder: (r: Array, turtle: Turtle) => () => void)
        { }

        public tryDo(instructionText: string, turtle: Turtle): bool
        {
            var r = this.instructionTemplate.exec(instructionText);
            r && this.instructionBuilder(r, turtle);
            return !!r;
        }

        public match(instructionText: string) {
            return this.instructionTemplate.exec(instructionText);
        }

        public build (instructionText: string, turtle: Turtle) {
            var matchResult = this.instructionTemplate.exec(instructionText);

            if (matchResult) {
                return this.instructionBuilder(matchResult, turtle);
            }

            return null;
        }
    }

    export class Turtle
    {
        public static possibleInstructions: TurtleInstruction[] = [
            new TurtleInstruction(
                /^FORWARD ([0-9]+)$/,
                (r, t) => { return t.forward.bind(t, Number(r[1])) }
            ),
            new TurtleInstruction(
                /^ROTATE (-?[0-9]+)$/,
                (r, t) => { return t.rotate.bind(t, Number(r[1])) }
            ),
            new TurtleInstruction(
                /^CHECKPOINT$/,
                (r, t) => { return t.save.bind(t) }
            ),
            new TurtleInstruction(
                /^RETURN$/,
                (r, t) => { return t.restore.bind(t) }
            )
        ];

        ctx: CanvasRenderingContext2D;
        penDown: bool = false;
        penStates: bool[] = [];
        rotation: number;

        constructor(ctx : CanvasRenderingContext2D)
        {
            this.ctx = ctx;
        }

        public parseInstruction(instruction: string): void
        {
            for (var i: number = 0; i < Turtle.possibleInstructions.length; i++)
                if (Turtle.possibleInstructions[i].tryDo(instruction, this))
                    break;
        }



        public rotate(angle: number): void
        {
            angle = angle / Math.PI * 180;
            this.rotation += angle;
            this.ctx.rotate(angle);
        }

        public forward(steps: number = 1): void
        {
            this.ctx.translate(0, steps);

            if (this.penDown)
            {
                this.ctx.lineTo(0, 0);
            }
            else
            {
                this.ctx.moveTo(0,0);
            }
        }

        public save(): void
        {
            this.ctx.save();
            this.penStates.push(this.penDown);
        }

        public restore(): void
        {
            this.ctx.restore();
            this.penDown = this.penStates.pop();
        }

        public putPenDown(): void
        {
            this.penDown = true;
            this.ctx.beginPath();
        }

        public putPenUp(): void
        {
            this.penDown = false;
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
}
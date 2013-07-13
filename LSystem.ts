
module LSystems {
    export class ProductionRule
    {
        constructor(public predecessor: string = "", public successor: string = "")
        { }

        public static makeConstant(symbol: string): ProductionRule
        {
            return new ProductionRule(symbol, symbol);
        }

        public toString() : string
        {
            return this.predecessor + " -> " + this.successor
        }
    }

    export class System
    {
        public alphabet: {};
        public start: string;
        public rules: ProductionRule[];

        public recursions: string[] = [];
        public recursionCounter: number = 0;
        public currentRecursion: string;

        constructor (start: string = "", rules: ProductionRule[] = [])
        {
            this.rules = rules;
            this.start = start;

            this.currentRecursion = start;
            this.recursions.push(start);
        }

        public rewrite(): string
        {
            console.log("rewriting " + this.currentRecursion + "...");

            var newRecursion = "";
            var currentRule: ProductionRule;
            for (var symbolIndex: number = 0; symbolIndex < this.currentRecursion.length; symbolIndex++)
            {
                for (var ruleIndex: number = 0; ruleIndex < this.rules.length; ruleIndex++)
                {
                    currentRule = this.rules[ruleIndex];
                    if (this.currentRecursion[symbolIndex] === currentRule.predecessor)
                    {
                        newRecursion += currentRule.successor;
                        break;
                    }
                }
            }

            this.recursionCounter++;
            this.currentRecursion = newRecursion;
            this.recursions.push(newRecursion);

            console.log("rewritten to " + newRecursion);

            return newRecursion;
        }
    }
}
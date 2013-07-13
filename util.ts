
module Util
{
    export function lerp(one: number, other: number, t: number): number {
        return one + (other - one) * t
    }

    export  class Vector
    {
        public x: number;
        public y: number;

        public getSqrSize(): number
        {
            return this.x * this.x + this.y * this.y
        }
    }
}
declare module 'ml-cart' {
  export class DecisionTreeRegression {
    constructor(options?: any);
    train(X: number[][], y: number[]): void;
    predict(X: number[][]): number[];
    toJSON(): any;
  }
}

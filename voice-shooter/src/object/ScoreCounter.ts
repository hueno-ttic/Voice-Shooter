export default class ScoreCounter {
    private _successCount: number;
    private _failedCount: number;

    constructor() {
        this._successCount = 0;
        this._failedCount = 0;
    }

    public addSuccess(): number {
        this._successCount++;
        return this._successCount;
    }

    public addFailed(): number {
        this._failedCount++;
        return this._failedCount;
    }

    get success(): number {
        return this._successCount;
    }

    get failed(): number {
        return this._failedCount;
    }

    get total(): number {
        return this._successCount + this._failedCount;
    }
}

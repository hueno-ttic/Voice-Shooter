import axios, { AxiosResponse } from "axios";
import fft from "../../../../assets/fft/build/*.data";
import json from "../../../../assets/fft/build/*.json";
import { MusicInfo } from "../../../../interface/MusicInfo";

const DUMMY_LENGTH = 30 * 100; // ダミーのデータを用意する時間( 10 sec )
const LENGTH_OF_SILENCE = 100; // ダミーデータの無音時間( 1 sec )

export default class GainRepository {
    private readonly size: number;
    private gains: number[][];
    private loadStatus: boolean = true;
    private loaded: boolean = false;

    constructor(size: number, musicInfo: MusicInfo) {
        this.size = size;
        this.gains = this.genDummyData();
        this.loadStatus = false;

        // TODO: 一旦固定のJSON 実際は曲ごとにJSONを読み分ける
        (async () => {
            let name = musicInfo.key + ".data";
            console.log(name);
            const files: string[] = json[musicInfo.key + ".data"];
            for (const idx in files) {
                const file = files[idx].replace(".data", "");
                const response = await axios.get<
                    number[][],
                    AxiosResponse<number[][]>
                >(fft[file]);

                // ロード済みなら配列の連結、初回ロード時はダミーデータを置き換え
                if (!this.loaded) {
                    this.gains = response.data;
                    this.loaded = true;
                } else {
                    this.gains = this.gains.concat(response.data);
                }

                this.loadStatus = false;
            }
        })();
    }

    public getGain(position: number, width: number = 3): number[][] {
        return Array.from({ length: width * 2 }, (v, k) =>
            this.getGainByPosition(position - width + k)
        );
    }

    public isLoading() {
        return this.loadStatus;
    }

    private getGainByPosition(position: number): number[] {
        const index = Math.floor(position / 10);

        // gainにデータがあればそれを返却
        if (
            position >= 0 &&
            this.gains.length > index &&
            this.gains[index] &&
            this.gains[index].length > 0
        ) {
            return this.gains[index];
        }

        // データがないときは0埋めしたゲインを返却
        return Array<number>(this.size).fill(0.0);
    }

    private genDummyData(): number[][] {
        return Array.from({ length: DUMMY_LENGTH }, (v, k) => {
            if (k > LENGTH_OF_SILENCE) {
                return Array.from({ length: this.size }, (v, idx) => {
                    return (
                        (Math.random() * (this.size - idx + this.size)) /
                        this.size /
                        2
                    );
                });
            } else {
                return Array<number>(this.size).fill(0.0);
            }
        });
    }
}

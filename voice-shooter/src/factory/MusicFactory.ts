import { MusicInfo } from "../interface/MusicInfo";

export function buildMusicInfo(): MusicInfo[] {
    let natsu: MusicInfo = {
        id: 1,
        title: "夏をなぞって",
        label: "natsu",
        author: "シロクマ消しゴム",
        url: "https://www.youtube.com/watch?v=3wbZUkPxHEg",
        playerVideoOptions: {
            video: {
                // 音楽地図訂正履歴: https://songle.jp/songs/2121406/history
                beatId: 3953764,
                repetitiveSegmentId: 2099662,
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FR6EN%2F20210222075543
                lyricId: 52062,
                lyricDiffId: 5133,
            },
        },
        image: "thumb_natsu",
        key: "3wbZUkPxHEg",
    };

    let first_note: MusicInfo = {
        id: 2,
        title: "First Note",
        label: "first_note",
        author: "blues",
        url: "https://piapro.jp/t/FDb1/20210213190029",
        playerVideoOptions: {
            video: {
                // 音楽地図訂正履歴: https://songle.jp/songs/2121525/history
                beatId: 3953882,
                repetitiveSegmentId: 2099561,
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FFDb1%2F20210213190029
                lyricId: 52065,
                lyricDiffId: 5093,
            },
        },
        image: "thumb_first_note",
        key: "0XG_isaNVRA",
    };

    let kokoro: MusicInfo = {
        id: 3,
        title: "その心に灯る色は",
        label: "sonokokoro",
        author: "ラテルネ",
        url: "https://www.youtube.com/watch?v=bMtYf3R0zhY",
        playerVideoOptions: {
            video: {
                // 音楽地図訂正履歴: https://songle.jp/songs/2121404/history
                beatId: 3953902,
                repetitiveSegmentId: 2099660,
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=bMtYf3R0zhY
                lyricId: 52093,
                lyricDiffId: 5177,
            },
        },
        image: "thumb_sonokokoro",
        key: "bMtYf3R0zhY",
    };

    let freedom: MusicInfo = {
        id: 4,
        title: "Freedom!",
        label: "freedom",
        author: "Chiquewa",
        url: "https://www.youtube.com/watch?v=pAaD4Hta0ns",
        playerVideoOptions: {
            video: {
                // 音楽地図訂正履歴: https://songle.jp/songs/2121403/history
                beatId: 3953761,
                repetitiveSegmentId: 2099586,
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FN--x%2F20210204215604
                lyricId: 52094,
                lyricDiffId: 5171,
            },
        },
        image: "thumb_freedom",
        key: "pAaD4Hta0ns",
    };

    let hisoka: MusicInfo = {
        id: 5,
        title: "密かなる交信曲",
        label: "hisoka",
        author: "濁茶",
        url: "https://www.youtube.com/watch?v=Ch4RQPG1Tmo",
        playerVideoOptions: {
            video: {
                // 音楽地図訂正履歴: https://songle.jp/songs/2121407/history
                beatId: 3953917,
                repetitiveSegmentId: 2099665,
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=Ch4RQPG1Tmo
                lyricId: 52063,
                lyricDiffId: 5149,
            },
        },
        image: "thumb_hisoka",
        key: "Ch4RQPG1Tmo",
    };

    let usomo: MusicInfo = {
        id: 6,
        title: "嘘も本当も君だから",
        label: "usomo",
        author: "真島ゆろ",
        url: "https://www.youtube.com/watch?v=Se89rQPp5tk",
        playerVideoOptions: {
            video: {
                // 音楽地図訂正履歴: https://songle.jp/songs/2121405/history
                beatId: 3953908,
                repetitiveSegmentId: 2099661,
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FYW_d%2F20210206123357
                lyricId: 52061,
                lyricDiffId: 5123,
            },
        },
        image: "thumb_usomo",
        key: "Se89rQPp5tk",
    };

    return [natsu, first_note, kokoro, freedom, hisoka, usomo];
}

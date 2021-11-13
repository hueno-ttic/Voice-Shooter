import { PlayerVideoOptions } from "textalive-app-api";

export class MusicInfo {
    id: number;
    title: string;
    label: string;
    author: string;
    url: string;
    playerVideoOptions?: PlayerVideoOptions;
    image: string;
    key: string;
}

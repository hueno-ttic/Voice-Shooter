import { POINT_SIZE } from "../scenes/audioVisualizer/app/constants/constants";
import * as fs from "fs";
import BuildFftRepository from "../scenes/audioVisualizer/infrastructure/repository/BuildFftRepository";

const ROOT_PATH = "src/assets/fft/";
const READ_PATH = ROOT_PATH + "raw/";
const WRITE_PATH = ROOT_PATH + "build/";

const repository = new BuildFftRepository(POINT_SIZE);

fs.readdirSync(READ_PATH).map((file) => {
    const path = READ_PATH + file;
    console.log("load data file => " + path);
    const gains = JSON.parse(fs.readFileSync(path).toString()) as number[][];
    console.log("total length : " + gains.length + " => " + path);
    console.log("analyse data file => " + path);
    const chunks = repository.convertFftData(gains);

    const result: string[] = [];
    chunks.map((converted, idx) => {
        const writeFile = idx + "_" + file;
        const writePath = WRITE_PATH + writeFile;
        result.push(writeFile);
        fs.writeFileSync(writePath, JSON.stringify(converted));
        console.log("write chunk file => " + writePath);
    });

    const jsonPath = WRITE_PATH + file + ".json";
    console.log("write file list => " + jsonPath);
    fs.writeFileSync(jsonPath, JSON.stringify(result));
});

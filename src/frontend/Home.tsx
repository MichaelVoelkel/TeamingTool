import MainController from "app/main_controller";
import React, { useState } from "react";
import { Label, Stage, Rect, Text, Layer, Group, Transformer, Line } from "react-konva";
import { Team } from "./components/Team";

export default function Home(props: any) {
    const {mainController}: {mainController: MainController} = props;
    const [names, setNames] = useState<string[]>([]);
    const [gurke, setGurke] = useState<string>("");

    const foo = () => {
        const xnames = ["erster", "zweiter", "dritter"];


        names.push(xnames[names.length]);
        setNames([...names]);
    };

    return <div className="flex flex-col text-zinc-400 h-full overflow-hidden">
        <h1 className="text-4xl p-10 text-center w-full flex-0 ">Teaming</h1>
        <button onClick={foo}>hi</button>

        <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
        <Team names={names} />
        </Layer>
        </Stage>
    </div>
}
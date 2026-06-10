import { useEffect, useState } from "react";
import * as Tone from "tone";

export default function Playhead() {
    const [left, setLeft] = useState(0);

    useEffect(() => {
        const update = () => {
            const position = Tone.Transport.seconds * 120;

            setLeft(position);

            requestAnimationFrame(update);
        };

        update();

        return () => { };
    }, []);

    return (
        <div
            className="absolute top-0 bottom-0 w-[3px] bg-red-500 z-50"
            style={{
                left: `${left}px`,
            }}
        />
    );
}
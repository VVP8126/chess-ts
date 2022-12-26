import { useState } from "react";
import { Player } from "../models/player/Player";

export default function usePlayer(pl: Player | null) {
    const [player, setPlayer] = useState<Player | null>(pl);
    return { player, setPlayer };
}
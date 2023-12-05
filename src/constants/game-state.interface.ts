import GameStatesEnum from "./game-states.enum";

export interface GameStateInterface {
    currentState: GameStatesEnum,
    currentLevel: string,
}


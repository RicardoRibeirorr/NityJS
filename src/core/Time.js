import { Game } from "./Game.js";

export class Time{
    static deltaTime(){
        return Game.instance._deltaTime;
    }
}
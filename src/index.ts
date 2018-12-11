import dat from "dat.gui";
import { Color, Engine, Loader, DisplayMode } from "excalibur";
import _ from "lodash";

import MapMaker from "./MapMaker";

class Game extends Engine {
  loader: Loader;
  dui: dat.GUI;

  constructor() {
    super({
      suppressPlayButton: true,
      displayMode: DisplayMode.Fixed
    });

    this.loader = new Loader();
    this.dui = new dat.GUI();
    this.dui.add(this, "isDebug");
  }

  public start() {
    window.addEventListener("contextmenu", e => e.preventDefault());

    this.add("mapMaker", new MapMaker(this.dui, this.loader));
    this.goToScene("mapMaker");

    this.isDebug = false;

    return super.start(this.loader);
  }
}

document.body.style.margin = "0px";
document.body.style.backgroundColor = "black";
document.body.style.overflow = "hidden";

const game = new Game();
game.start();

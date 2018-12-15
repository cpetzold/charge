import dat from "dat.gui";
import { DisplayMode, Engine, Loader, Physics } from "cpetzold-excalibur";
import _ from "lodash";

import MapMaker from "./MapMaker";
import * as resources from "./resources";

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

    this.isDebug = true;
    this.dui.add(this, "isDebug");
  }

  public start() {
    window.addEventListener("contextmenu", e => e.preventDefault());

    _.each(resources, resource => this.loader.addResource(resource));

    this.add("mapMaker", new MapMaker(this.dui));
    this.goToScene("mapMaker");

    return super.start(this.loader);
  }
}

document.body.style.margin = "0px";
document.body.style.backgroundColor = "black";
document.body.style.overflow = "hidden";

Physics.acc.setTo(0, 700);

const game = new Game();
game.start();

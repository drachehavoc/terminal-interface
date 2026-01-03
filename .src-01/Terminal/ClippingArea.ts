import type { Square } from "./Math"
import { Tagueur } from "./Tagueur"

export class ClippingArea {
  #tagueur = new Tagueur()

  constructor(
    protected _square: Square
  ) { }

  draw() {
    
  }
}
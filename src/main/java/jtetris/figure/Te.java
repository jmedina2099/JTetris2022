package jtetris.figure;

import java.util.ArrayList;

import jtetris.app.model.FiguraBD;
import jtetris.engine.Engine;

/**
 * @author jmedina
 *
 */
public class Te extends Figure {

	public Te( Engine engine, Colour colour, FiguraBD figura ) {
		super(colour,engine,figura);
	}
	
	Te( int numRotations, int rotation, ArrayList<Box> boxes, Punto p, Colour colour ) {
		super(numRotations,rotation,boxes,p,colour);
	}

}

package jtetris.figure;

import java.util.ArrayList;

import jtetris.engine.Engine;

/**
 * @author jmedina
 *
 */
public class Ele extends Figure {

	public Ele( Engine engine, Colour colour ) {
		super(4,colour);
		init(engine);
	}
	
	Ele( int rotation, ArrayList<Box> boxes, Punto p, Colour colour ) {
		super(4,rotation,boxes,p,colour);
	}

	private void init( Engine engine ) {
		double centerX = 4*Box.SIZE;
		super.listBoxes.add( new Box(engine,this,centerX,0) );
		super.listBoxes.add( new Box(engine,this,centerX,Box.SIZE) );
		super.listBoxes.add( new Box(engine,this,centerX,2*Box.SIZE) );
		super.listBoxes.add( new Box(engine,this,centerX+Box.SIZE,2*Box.SIZE) );
		super.center.setLocation( centerX+Box.SIZE, Box.SIZE );
	}
}

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
		super.listBoxes.add( new Box(engine,this,0,0) );
		super.listBoxes.add( new Box(engine,this,0,Box.SIZE) );
		super.listBoxes.add( new Box(engine,this,0,2*Box.SIZE) );
		super.listBoxes.add( new Box(engine,this,Box.SIZE,2*Box.SIZE) );
		super.center.setLocation( Box.SIZE, Box.SIZE );
	}
}

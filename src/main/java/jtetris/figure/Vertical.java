package jtetris.figure;

import java.util.ArrayList;

import jtetris.engine.Engine;

/**
 * @author jmedina
 *
 */
public class Vertical extends Figure {
	
	public Vertical( Engine engine, Colour colour ) {
		super(2,colour);
		init(engine);
	}
	Vertical( int rotation, ArrayList<Box> boxes, Punto p, Colour colour ) {
		super(2,rotation,boxes,p,colour);
	}

	private void init( Engine engine ) {
		super.listBoxes.add( new Box(engine,this,0,0) );
		super.listBoxes.add( new Box(engine,this,Box.SIZE,0) );
		super.listBoxes.add( new Box(engine,this,2*Box.SIZE,0) );
		super.listBoxes.add( new Box(engine,this,3*Box.SIZE,0) );
		super.center.setLocation( Box.SIZE, 0 );
	}
}

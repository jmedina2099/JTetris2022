package jtetris.figure;

import java.util.ArrayList;

import jtetris.engine.Engine;

/**
 * @author jmedina
 *
 */
public class Te extends Figure {

	public Te( Engine engine, Colour colour ) {
		super(4,colour);
		init(engine);
	}
	
	Te( int rotation, ArrayList<Box> boxes, Punto p, Colour colour ) {
		super(4,rotation,boxes,p,colour);
	}

	private void init( Engine engine ) {
		super.listBoxes.add( new Box(engine,this,0,Box.SIZE) );
		super.listBoxes.add( new Box(engine,this,Box.SIZE,Box.SIZE) );
		super.listBoxes.add( new Box(engine,this,Box.SIZE,0) );
		super.listBoxes.add( new Box(engine,this,2*Box.SIZE,Box.SIZE) );
		super.center.setLocation( Box.SIZE, Box.SIZE );
	}
}

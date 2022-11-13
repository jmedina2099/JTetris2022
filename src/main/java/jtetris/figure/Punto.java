package jtetris.figure;

import java.awt.geom.Point2D;

/**
 * @author jmedina
 *
 */
public class Punto 
	extends Point2D.Double {

	private static final long serialVersionUID = -4289521689838139039L;

	public Punto() {
		super();
	}
	
	public Punto(double x, double y) {
        super(x,y);
    }
	
	@Override
	public Object clone() {
		return new Punto( super.x, super.y );
	}
	
	@Override
	public String toString() {
		return super.x+","+super.y;
	}
}

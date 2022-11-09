package jtetris.figure;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.geom.Rectangle2D;
import java.util.ArrayList;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import jtetris.engine.Engine;

/**
 * @author jmedina
 *
 */
public class Box implements Cloneable {
	
	@JsonIgnore
	public Figure figure;

	@JsonIgnore
	private Engine engine;
	
	@JsonUnwrapped
	public Punto coord;
	
	@JsonUnwrapped
	public String color;

	@JsonIgnore
	public final static double SIZE = 20d;

	public Box( Engine engine, Figure figure, double x, double y ) {
		this.engine = engine;
		this.figure = figure;
		this.coord = new Punto(x, y);
		this.color = figure.colour.hexaColor;
	}
	
	private Box( Engine engine, Figure figure, Punto origen ) {
		this.engine = engine;
		this.figure = figure;
		this.coord = origen;
		this.color = figure.colour.hexaColor;
	}
	
	@Override
	public int hashCode() {
		return coord.hashCode();
	}
	
	public boolean hit(Object obj) {
		Box box = (Box)obj;
		return ( coord.x == box.coord.x && 
				 coord.y == box.coord.y );
	}
	
	public boolean hitDown(Object obj) {
		Box box = (Box)obj;
		return ( coord.x == box.coord.x && 
				 coord.y == box.coord.y+Box.SIZE );
	}
	
	public boolean hitRight(Object obj) {
		Box box = (Box)obj;
		return ( coord.x == box.coord.x+Box.SIZE && 
				 coord.y == box.coord.y );
	}

	public boolean hitLeft(Object obj) {
		Box box = (Box)obj;
		return ( coord.x == box.coord.x-Box.SIZE && 
				 coord.y == box.coord.y );
	}

	@Override
	protected Box clone() {
		return new Box( this.engine, this.figure, (Punto)this.coord.clone() );
	}
	
	public void paint( Graphics2D g2, Color color ) {
		Rectangle2D.Double box = new Rectangle2D.Double(coord.x,coord.y,Box.SIZE,Box.SIZE);

		g2.setColor( color );
		g2.fill( box );
		g2.setColor( Color.BLACK );
		g2.draw( box );
	}
	
	@Override
	public String toString() {
		return coord.toString();
	}

	public void clearBox() {
		this.figure.listBoxes = this.figure.listBoxes.stream().filter( x -> !x.equals(this) ).collect(Collectors.toCollection(ArrayList::new));
		if( this.figure.listBoxes.isEmpty() ) {
			this.engine.listFigures = this.engine.listFigures.stream().filter( x -> !x.equals(this.figure) ).collect(Collectors.toCollection(ArrayList::new));
		}
	}
}

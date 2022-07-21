package jtetris.figure;

import java.awt.Color;
import java.util.Random;

import jtetris.engine.Engine;

/**
 * @author jmedina
 *
 */
public class FigureFactory {
	
	public enum Shape {
	    ELE(0), TE(1), VERTICAL(2); 
		
		private final int index;
		Shape( int i ) {
			this.index = i;
		}
		
		public int getIndex() {
			return index;
		}
	}
	
	public Color[] colores = new Color[] { 
			Color.decode("#162CA2"),
			Color.decode("#1849CA"),
			Color.decode("#FFFFFF"),
			Color.decode("#EC2004"),
			Color.decode("#C31D10")
	};

	private Random random = new Random();
	private Engine engine;

	public FigureFactory( Engine engine ) {
		this.engine = engine;
	}
	
	public Figure getNextFigure() {
		
		Figure figure = null;
		
		Color color = colores[random.nextInt(colores.length)];
		Colour colour = new Colour(color);
		
		Shape[] formas = Shape.values();
		int nextInt = random.nextInt(formas.length);
		Shape next = formas[nextInt];
		switch (next) {
		case ELE:
			figure = new Ele(this.engine,colour);
			break;
		case TE:
			figure = new Te(this.engine,colour);
			break;
		case VERTICAL:
			figure = new Vertical(this.engine,colour);
			break;			
		default:
			break;
		}
		
		return figure;
	}
}

package jtetris.figure;

import java.awt.Color;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import jtetris.app.model.FiguraBD;
import jtetris.engine.Engine;

/**
 * @author jmedina
 *
 */
public class FigureFactory {
		
	public enum Shape {
	    ELE(0,"Ele",Ele.class), TE(1,"Te",Te.class), VERTICAL(2,"Vertical",Vertical.class); 
		
		private final int index;
		private final String name;
		private final Class<? extends Figure> clazz;
		
		Shape( int i, String name, Class<? extends Figure> clazz ) {
			this.index = i;
			this.name = name;
			this.clazz = clazz;
		}
		
		public int getIndex() {
			return index;
		}
		
		public String getName() {
			return name;
		}
		
		public Class<? extends Figure> getClazz() {
			return clazz;
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
	HashMap<String,FiguraBD> map;

	public FigureFactory( Engine engine ) {
		this.engine = engine;
	}
	
	private void init() {
		List<FiguraBD> figuras = this.engine.figuraService.findAll();
		map = new HashMap<String,FiguraBD>();  
		figuras.forEach( figura -> {
			map.put( figura.getName(), figura );
		});
	}

	public Figure getNextFigure() {
		if( map == null )
			init();
		
		Figure figure = null;
		
		Color color = colores[random.nextInt(colores.length)];
		Colour colour = new Colour(color);
		
		Shape[] formas = Shape.values();
		int nextInt = random.nextInt(formas.length);

		Shape next = formas[nextInt];
		FiguraBD figura = map.get(next.getName());
		
		try {
			figure = next.getClazz()
				.getConstructor( Engine.class, Colour.class, FiguraBD.class )
				.newInstance( this.engine,colour,figura );
		} catch (InstantiationException | IllegalAccessException | IllegalArgumentException | InvocationTargetException
				| NoSuchMethodException | SecurityException e) {
			e.printStackTrace();
		}
		
		return figure;
	}
}

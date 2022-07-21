package jtetris.figure;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author jmedina
 *
 */
public abstract class Figure implements Cloneable {

	protected Punto center = new Punto();
	public ArrayList<Box> listBoxes = new ArrayList<Box>();
	
	public final static int RIGHT_ROTATION = 1;
	public final static int LEFT_ROTATION = -1;
	
	public int numRotations;
	public int rotation = 0;
	
	public Colour colour;
	
	protected Figure( int numRotations, Colour colour ) {
		this.numRotations = numRotations;
		this.colour = colour;
	}
	
	protected Figure( int numRotations, int rotation, ArrayList<Box> boxes, Punto p, Colour colour ) {
		this.numRotations = numRotations;
		this.rotation = rotation;
		this.listBoxes = boxes;
		this.center = p;
		this.colour = colour;
	}
	
	public ArrayList<Box> getListBoxes() {
		return listBoxes.stream().map( b -> (Box)b.clone() ).collect( Collectors.toCollection(ArrayList::new));
	}
	
	public boolean hit( ArrayList<Box> boxesFalling ) {
		boolean chokaVar[] = { false };
		this.listBoxes.stream().forEach( x -> {
			boxesFalling.stream().forEach( b -> {
				if( x.hit(b) ) {
					chokaVar[0] = true;
				}
			});
		});
		return chokaVar[0];
	}
	
	public boolean hitDown( ArrayList<Box> boxesFalling ) {
		boolean chokaVar[] = { false };
		this.listBoxes.stream().forEach( x -> {
			boxesFalling.stream().forEach( b -> {
				if( x.hitDown(b) ) {
					chokaVar[0] = true;
				}
			});
		});
		return chokaVar[0];
	}
	
	public boolean hitRight( ArrayList<Box> boxesFalling ) {
		boolean chokaVar[] = { false };
		this.listBoxes.stream().forEach( x -> {
			boxesFalling.stream().forEach( b -> {
				if( x.hitRight(b) ) {
					chokaVar[0] = true;
				}
			});
		});
		return chokaVar[0];
	}
	
	public boolean hitLeft( ArrayList<Box> boxesFalling ) {
		boolean chokaVar[] = { false };
		this.listBoxes.stream().forEach( x -> {
			boxesFalling.stream().forEach( b -> {
				if( x.hitLeft(b) ) {
					chokaVar[0] = true;
				}
			});
		});
		return chokaVar[0];
	}
	
	public Punto getCenter() {
		return this.center;
	}
	
	public Figure clone() {
		try {
			return this.getClass()
					.getDeclaredConstructor( new Class[] { int.class, ArrayList.class, Punto.class, Colour.class } )
					.newInstance( this.rotation, getListBoxes(), (Punto)center.clone(), this.colour );
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		}
		return null;
		
	}

	public void rotate( int direction) {
		Punto p = getCenter();
		Punto[] srcPts = new Punto[this.listBoxes.size()];
		getBoxCoords(srcPts);
		
		if( numRotations == 2 ) {
			if( rotation != 0 ) {
				direction = -1*direction;
				rotation = 0;
			} else {
				rotation = 1;
			}
		} else {
			rotation++;
			rotation = rotation % numRotations;
		}
		
		AffineTransform translate1 = AffineTransform.getTranslateInstance(-p.getX(),-p.getY());
		AffineTransform rotate = AffineTransform.getRotateInstance( direction*Math.toRadians(90d) );
		AffineTransform translate2 = AffineTransform.getTranslateInstance(p.getX(),p.getY());
		
		translate2.concatenate(rotate);
		translate2.concatenate(translate1);
		translate2.transform( srcPts, 0, srcPts, 0, srcPts.length );
	}
	
	public void moveUp() {
		this.listBoxes.stream().forEach( x -> {
			x.coord.y -= Box.SIZE;
		});
		this.center.y -= Box.SIZE;
	}
	
	public void moveDown() {
		this.listBoxes.stream().forEach( x -> {
			x.coord.y += Box.SIZE;
		});
		this.center.y += Box.SIZE;
	}
	
	public void moveRight() {
		this.listBoxes.stream().forEach( x -> {
			x.coord.x += Box.SIZE;
		});
		this.center.x += Box.SIZE;
	}

	public void moveLeft() {
		this.listBoxes.stream().forEach( x -> {
			x.coord.x -= Box.SIZE;
		});
		this.center.x -= Box.SIZE;
	}

	private Punto[] getBoxCoords( Punto[] src ) {
		int[] index = { 0 };
		this.listBoxes.stream().forEach( x -> {
			src[index[0]++] = x.coord;
		});
		return src;
	}
	
	public double getXMin() {
		double leftCorner[] = { 200d };
		this.listBoxes.stream().forEach( x -> {
			if( x.coord.x < leftCorner[0] ) {
				leftCorner[0] = x.coord.x;
			}
		});
		return leftCorner[0];
	}
	
	public double getXMax() {
		double rightCorner[] = { 0d };
		this.listBoxes.stream().forEach( x -> {
			if( rightCorner[0] < x.coord.x ) {
				rightCorner[0] = x.coord.x;
			}
		});
		return rightCorner[0];
	}
	
	public double getYMin() {
		double topCorner[] = { 400d };
		this.listBoxes.stream().forEach( x -> {
			if( x.coord.y < topCorner[0] ) {
				topCorner[0] = x.coord.y;
			}
		});
		return topCorner[0];
	}	

	public double getYMax() {
		double bottomCorner[] = { 0d };
		this.listBoxes.stream().forEach( x -> {
			if( bottomCorner[0] < x.coord.y ) {
				bottomCorner[0] = x.coord.y;
			}
		});
		return bottomCorner[0];
	}	
	
	public void paint( Graphics2D g2 ) {
		this.listBoxes.stream().forEach( x -> doPaint(x::paint,g2) );
	}
	
	private interface PaintWithGraphics2D {
	    public void paint(Graphics2D g2,Color c);
	}

	private void doPaint(PaintWithGraphics2D method, Graphics2D g2) {
		method.paint(g2,this.colour.color);
	}
	
	@Override
	public String toString() {
		return this.listBoxes.toString();
	}

	public List<Box> getBoxesWithY( double yMax ) {
		return this.listBoxes.stream().filter( x -> x.coord.y == yMax ).collect(Collectors.toList());
	}

}

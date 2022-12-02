package jtetris.app.model;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author jmedina
 *
 */
@Entity
@Table(name = "figuras")
public class FiguraBD {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String name;
	
	private String coordenadas;
	
	private int offsetx;
	
	private int rotaciones;
	
	private String center;

	public FiguraBD() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCoordenadas() {
		return coordenadas;
	}

	public void setCoordenadas(String coordenadas) {
		this.coordenadas = coordenadas;
	}
	
	public int getOffsetx() {
		return offsetx;
	}

	public void setOffsetx(int offsetx) {
		this.offsetx = offsetx;
	}
	
	public String getCenter() {
		return center;
	}

	public void setCenter(String center) {
		this.center = center;
	}
	
	public int getRotaciones() {
		return rotaciones;
	}

	public void setRotaciones(int rotaciones) {
		this.rotaciones = rotaciones;
	}

	public List<Point2D.Double> getPuntos() {
		
		String cadena = coordenadas.substring(1,coordenadas.length()-1);

		char charAt;
		int start=0, end=0;
		int[] coordenada = new int[2];
		List<Point2D.Double> lista = new ArrayList<Point2D.Double>();
		for( int i=0; i<cadena.length(); i++ ) {
			charAt = cadena.charAt(i);
			if( charAt == '(' ) {
				start = i+1;
			}
			if( charAt == ',' ) {
				if( cadena.substring(start, i).length() != 0 ) {
					end = i;
					coordenada[0] = Integer.parseInt(cadena.substring(start, end));
					start = end+1;
				}
			}
			if( charAt == ')' ) {
				if( cadena.substring(start, i).length() != 0 ) {
					end = i;
					coordenada[1] = Integer.parseInt(cadena.substring(start, end));
					start = end+1;
					lista.add( new Point2D.Double( coordenada[0],coordenada[1] ) );
				}
			}
		}
		
		return lista;
	}
	
	public Point2D.Double getPunto() {
		
		String cadena = center.substring(1,center.length()-1);
		int offset = cadena.indexOf(",");
		int a = Integer.parseInt(cadena.substring( 0, offset ));
		int b = Integer.parseInt(cadena.substring( offset+1, cadena.length() ));
		return new Point2D.Double(a,b);
		
	}	
}

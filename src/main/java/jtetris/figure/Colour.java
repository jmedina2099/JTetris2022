package jtetris.figure;

import java.awt.Color;

/**
 * @author jmedina
 *
 */
public class Colour {

	public Color color;
	
	public String hexaColor;
	
	public Colour( Color color ) {
		this.color = color;
		this.hexaColor = String.format("#%06X", 0xFFFFFF & color.getRGB());
	}
	
}

package jtetris.main;

import javax.swing.SwingUtilities;

import jtetris.ui.VentanaPrincipal;

/**
 * @author jmedina
 *
 */
public class Main {

	protected static void createAndShowGUI() {
		VentanaPrincipal frame = new VentanaPrincipal();
		frame.setVisible( true );
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Runnable uiTarget = () -> createAndShowGUI();
        SwingUtilities.invokeLater(uiTarget);
	}
}

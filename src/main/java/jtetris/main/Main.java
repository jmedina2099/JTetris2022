package jtetris.main;

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
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                createAndShowGUI();
            }
        });
	}
}

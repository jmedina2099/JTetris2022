/**
 * 
 */
package jtetris.app.service;

import java.util.List;

import jtetris.app.model.FiguraBD;

/**
 * @author jmedina
 *
 */
public interface IFiguraService {

	List<FiguraBD> findAll();
}

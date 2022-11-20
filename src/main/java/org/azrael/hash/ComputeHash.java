/**
 * 
 */
package org.azrael.hash;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author jmedina
 *
 */
@Component
public class ComputeHash {

	@Autowired
	Azrael64 funcionHash;
	
	public int hashCode( String cadena ) {
		return this.funcionHash.getHash( cadena.getBytes((StandardCharsets.UTF_8)) ).intValue();
	}
	
	
}

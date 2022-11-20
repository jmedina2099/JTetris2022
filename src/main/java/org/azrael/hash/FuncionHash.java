/**
 * 
 */
package org.azrael.hash;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;

/**
 * @author jmedina
 *
 */
@FunctionalInterface
public interface FuncionHash {

	public BigInteger getHash( byte[] o);
	
	default BigInteger compute(String key, int size, BigInteger... indexAndHash ) {
		indexAndHash[1] = getHash(key.getBytes(StandardCharsets.UTF_8));
		BigInteger mod = indexAndHash[1].mod( new BigInteger(""+size) );
		return mod;
	}
	
}

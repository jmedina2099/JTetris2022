package jtetris.main;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@ComponentScan({ "jtetris.api", "jtetris.engine" })
public class Application {
	
	private int port = 3000;	

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
	
	private String getExternalIP() {
		try {
			InetAddress inetAddress = InetAddress.getLocalHost();
			String hostAddress = inetAddress.getHostAddress();
			System.out.println( "host="+hostAddress );
			return hostAddress;
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		return "localhost";
	}

    @Bean
    WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:"+port,"http://" + getExternalIP() +":"+port,"http://13.52.252.10:"+port);
            }
        };
    }
	
}
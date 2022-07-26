package jtetris.main;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@ComponentScan({ "jtetris.api", "jtetris.engine", "org.azrael.hash", "jtetris.app" })
@EnableJpaRepositories("jtetris.app.repository")
@EntityScan("jtetris.app.model")
public class Application {
	
	private int portReact = 3000;
	private int portAngular = 4200;

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
                registry.addMapping("/**")
                .allowedOrigins(
                		"http://localhost:"+portReact,
                		"http://" + getExternalIP() +":"+portReact,
						"http://jtetrisappreact.azurewebsites.net",
						"https://jtetrisappreact.azurewebsites.net",
                		"http://localhost:"+portAngular,
                		"http://" + getExternalIP() +":"+portAngular);
            }
        };
    }
	
}
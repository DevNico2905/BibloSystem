package com.biblioteca.libros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LibrosServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibrosServiceApplication.class, args);
        System.out.println("===========================================");
        System.out.println("📚 SERVICIO DE LIBROS INICIADO");
        System.out.println("Puerto: 8081");
        System.out.println("API: http://localhost:8081/api/libros");
        System.out.println("===========================================");
    }

}
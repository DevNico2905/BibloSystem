package com.biblioteca.usuarios.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.usuarios.model.Usuario;
import com.biblioteca.usuarios.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	@GetMapping
	public ResponseEntity<List<Usuario>> getAllUsuarios() {
		List<Usuario> usuarios = usuarioService.getAllUsuarios();
		return ResponseEntity.ok(usuarios);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Usuario> getUsuarioById(@PathVariable @NonNull Long id) {
		return usuarioService.getUsuarioById(id)
				.map(usuario -> ResponseEntity.ok(usuario))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Usuario> createUsuario(@RequestBody @NonNull Usuario usuario) {
		Usuario createdUsuario = usuarioService.createUsuario(usuario);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdUsuario);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Usuario> updateUsuario(@PathVariable @NonNull Long id, @RequestBody Usuario usuarioDetails) {
		return usuarioService.updateUsuario(id, usuarioDetails)
				.map(u -> ResponseEntity.ok(u))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUsuario(@PathVariable @NonNull Long id) {
		usuarioService.deleteUsuario(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{id}/activar")
	public ResponseEntity<Usuario> activarUsuario(@PathVariable @NonNull Long id) {
		return usuarioService.getUsuarioById(id)
				.map(usuario -> {
					usuario.setActivo(true);
					Usuario activado = usuarioService.updateUsuarioDirecto(usuario);
					return ResponseEntity.ok(activado);
				})
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PutMapping("/{id}/desactivar")
	public ResponseEntity<Usuario> desactivarUsuario(@PathVariable @NonNull Long id) {
		return usuarioService.getUsuarioById(id)
				.map(usuario -> {
					usuario.setActivo(false);
					Usuario desactivado = usuarioService.updateUsuarioDirecto(usuario);
					return ResponseEntity.ok(desactivado);
				})
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

}

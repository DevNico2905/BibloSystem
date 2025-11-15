package com.biblioteca.usuarios.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import com.biblioteca.usuarios.model.Usuario;
import com.biblioteca.usuarios.repository.UsuarioRepository;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	public List<Usuario> getAllUsuarios() {
		return usuarioRepository.findAll();
	}

	public Optional<Usuario> getUsuarioById(@NonNull Long id) {
		return usuarioRepository.findById(id);
	}

	public Usuario createUsuario(@NonNull Usuario usuario) {
		return usuarioRepository.save(usuario);
	}

	public Optional<Usuario> updateUsuario(@NonNull Long id, Usuario usuarioDetails) {
		return usuarioRepository.findById(id).map(usuario -> {
			usuario.setNombre(usuarioDetails.getNombre());
			usuario.setEmail(usuarioDetails.getEmail());
			usuario.setTelefono(usuarioDetails.getTelefono());
			usuario.setDireccion(usuarioDetails.getDireccion());
			return usuarioRepository.save(usuario);
		});
	}

	public void deleteUsuario(@NonNull Long id) {
		usuarioRepository.deleteById(id);
	}

	public Usuario updateUsuarioDirecto(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}

}

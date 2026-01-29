package service;

import model.Usuario;

public class UsuarioService {

    public void registrarUsuario(Usuario usuario) {
        System.out.println("Registrando usuario...");
        usuario.mostrarInfo();
    }
}

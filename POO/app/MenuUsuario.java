package app;

import model.Usuario;
import model.AdminUsuario;
import model.InvitadoUsuario;
import service.UsuarioService;
import java.util.Scanner;

public class MenuUsuario {
    private Scanner scanner;
    private UsuarioService servicio;

    public MenuUsuario() {
        this.scanner = new Scanner(System.in);
        this.servicio = new UsuarioService();
    }

    public void mostrarMenu() {
        System.out.println("\n" + "=".repeat(50));
        System.out.println("    SISTEMA DE REGISTRO DE USUARIOS");
        System.out.println("=".repeat(50));
        System.out.println("1. Registrar Administrador");
        System.out.println("2. Registrar Usuario Regular");
        System.out.println("3. Registrar Invitado");
        System.out.println("4. Salir");
        System.out.println("=".repeat(50));
    }

    public void ejecutar() {
        int opcion;

        do {
            mostrarMenu();
            System.out.print("Seleccione una opción: ");
            opcion = scanner.nextInt();
            scanner.nextLine(); // Limpiar el buffer

            switch (opcion) {
                case 1:
                    registrarAdmin();
                    break;
                case 2:
                    registrarUsuario();
                    break;
                case 3:
                    registrarInvitado();
                    break;
                case 4:
                    System.out.println("\n¡Hasta luego!");
                    break;
                default:
                    System.out.println("\nOpción no válida. Intente de nuevo.");
            }
        } while (opcion != 4);

        scanner.close();
    }

    private void registrarAdmin() {
        System.out.println("\n" + "-".repeat(50));
        System.out.println("REGISTRAR ADMINISTRADOR");
        System.out.println("-".repeat(50));

        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();

        System.out.print("Email: ");
        String email = scanner.nextLine();

        System.out.print("Rol: ");
        String rol = scanner.nextLine();

        Usuario admin = new AdminUsuario(nombre, email, rol);
        servicio.registrarUsuario(admin);
    }

    private void registrarUsuario() {
        System.out.println("\n" + "-".repeat(50));
        System.out.println("REGISTRAR USUARIO REGULAR");
        System.out.println("-".repeat(50));

        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();

        System.out.print("Email: ");
        String email = scanner.nextLine();

        Usuario usuario = new Usuario(nombre, email);
        servicio.registrarUsuario(usuario);
    }

    private void registrarInvitado() {
        System.out.println("\n" + "-".repeat(50));
        System.out.println("REGISTRAR INVITADO");
        System.out.println("-".repeat(50));

        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();

        Usuario invitado = new InvitadoUsuario(nombre);
        servicio.registrarUsuario(invitado);
    }
}

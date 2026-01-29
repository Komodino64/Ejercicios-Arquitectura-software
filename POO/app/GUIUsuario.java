package app;

import java.awt.*;
import java.awt.event.ActionEvent;
import javax.swing.*;
import model.AdminUsuario;
import model.InvitadoUsuario;
import model.Usuario;
import service.UsuarioService;

public class GUIUsuario extends JFrame {
    private JTextField nombreField;
    private JTextField emailField;
    private JTextField rolField;
    private JComboBox<String> tipoCombo;
    private JTextArea areaResultado;
    private UsuarioService servicio;

    public GUIUsuario() {
        servicio = new UsuarioService();

        // Configuración de la ventana
        setTitle("Sistema de Registro de Usuarios");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(500, 600);
        setLocationRelativeTo(null);
        setResizable(false);

        // Panel principal
        JPanel panelPrincipal = new JPanel();
        panelPrincipal.setLayout(new BoxLayout(panelPrincipal, BoxLayout.Y_AXIS));
        panelPrincipal.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        // Título
        JLabel titulo = new JLabel("Registro de Usuarios");
        titulo.setFont(new Font("Arial", Font.BOLD, 18));
        titulo.setAlignmentX(Component.CENTER_ALIGNMENT);
        panelPrincipal.add(titulo);
        panelPrincipal.add(Box.createVerticalStrut(20));

        // Tipo de usuario
        panelPrincipal.add(new JLabel("Tipo de Usuario:"));
        tipoCombo = new JComboBox<>(new String[]{"Usuario Regular", "Administrador", "Invitado"});
        tipoCombo.addActionListener(this::actualizarCampos);
        panelPrincipal.add(tipoCombo);
        panelPrincipal.add(Box.createVerticalStrut(15));

        // Nombre
        panelPrincipal.add(new JLabel("Nombre:"));
        nombreField = new JTextField(15);
        panelPrincipal.add(nombreField);
        panelPrincipal.add(Box.createVerticalStrut(10));

        // Email
        panelPrincipal.add(new JLabel("Email:"));
        emailField = new JTextField(15);
        panelPrincipal.add(emailField);
        panelPrincipal.add(Box.createVerticalStrut(10));

        // Rol (solo para Admin)
        panelPrincipal.add(new JLabel("Rol (Solo Admin):"));
        rolField = new JTextField(15);
        rolField.setEnabled(false);
        panelPrincipal.add(rolField);
        panelPrincipal.add(Box.createVerticalStrut(15));

        // Botón Registrar
        JButton btnRegistrar = new JButton("Registrar");
        btnRegistrar.setAlignmentX(Component.CENTER_ALIGNMENT);
        btnRegistrar.addActionListener(e -> registrarUsuario());
        panelPrincipal.add(btnRegistrar);
        panelPrincipal.add(Box.createVerticalStrut(20));

        // Área de resultados
        panelPrincipal.add(new JLabel("Registro (Últimas acciones):"));
        areaResultado = new JTextArea(8, 30);
        areaResultado.setEditable(false);
        areaResultado.setLineWrap(true);
        areaResultado.setWrapStyleWord(true);
        JScrollPane scrollPane = new JScrollPane(areaResultado);
        panelPrincipal.add(scrollPane);

        // Botón Limpiar
        JButton btnLimpiar = new JButton("Limpiar Campos");
        btnLimpiar.setAlignmentX(Component.CENTER_ALIGNMENT);
        btnLimpiar.addActionListener(e -> limpiarCampos());
        panelPrincipal.add(Box.createVerticalStrut(10));
        panelPrincipal.add(btnLimpiar);

        add(panelPrincipal);
        setVisible(true);
    }

    private void actualizarCampos(ActionEvent e) {
        String tipo = (String) tipoCombo.getSelectedItem();
        if ("Administrador".equals(tipo)) {
            rolField.setEnabled(true);
            emailField.setEnabled(true);
        } else if ("Invitado".equals(tipo)) {
            rolField.setEnabled(false);
            emailField.setEnabled(false);
            emailField.setText("");
        } else {
            rolField.setEnabled(false);
            emailField.setEnabled(true);
        }
    }

    private void registrarUsuario() {
        String nombre = nombreField.getText().trim();
        String tipo = (String) tipoCombo.getSelectedItem();

        if (nombre.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Ingrese un nombre", "Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Usuario usuario = null;

        if ("Administrador".equals(tipo)) {
            String email = emailField.getText().trim();
            String rol = rolField.getText().trim();

            if (email.isEmpty() || rol.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Complete todos los campos", "Error", JOptionPane.WARNING_MESSAGE);
                return;
            }

            usuario = new AdminUsuario(nombre, email, rol);
        } else if ("Usuario Regular".equals(tipo)) {
            String email = emailField.getText().trim();

            if (email.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Ingrese un email", "Error", JOptionPane.WARNING_MESSAGE);
                return;
            }

            usuario = new Usuario(nombre, email);
        } else if ("Invitado".equals(tipo)) {
            usuario = new InvitadoUsuario(nombre);
        }

        servicio.registrarUsuario(usuario);
        areaResultado.append(nombre + " (" + tipo + ") registrado exitosamente.\n");
        limpiarCampos();
    }

    private void limpiarCampos() {
        nombreField.setText("");
        emailField.setText("");
        rolField.setText("");
        tipoCombo.setSelectedIndex(0);
        actualizarCampos(null);
    }
}

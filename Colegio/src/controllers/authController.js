const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validar que todos los campos necesarios estén presentes
      if (!username || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }
  
      // Verificar si el usuario ya existe
      let existingUser = await User.findOne({ $or: [ { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
  
      // Crear nuevo usuario
      const user = new User({
        username,
        password
      });
  
      // Guardar usuario
      await user.save();
  
      // Generar token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Enviar respuesta exitosa
      return res.status(201).json({ 
        message: 'Usuario registrado exitosamente',
        user: { id: user._id, username: user.username}, 
        token 
      });
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
  };

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).send({ error: 'Login Fallo! Verifique las credenciales' });
    }
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ error: 'Login Fallo! Verifique las credenciales' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};
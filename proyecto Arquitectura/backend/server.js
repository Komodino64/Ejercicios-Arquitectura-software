require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const compression = require('compression');
const { body, param, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// ===========================
// SECURITY MIDDLEWARES
// ===========================
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(morgan('combined')); // HTTP logging

// CORS FLEXIBLE - Permitir red local (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:9999', // App de escritorio
  'http://127.0.0.1:8080',
  'http://127.0.0.1:9999'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, etc)
    if (!origin) {
      return callback(null, true);
    }
    
    // Permitir localhost y IPs de red local
    const localNetworkRegex = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}):(\d+)$/;
    
    if (allowedOrigins.includes(origin) || localNetworkRegex.test(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV !== 'production') {
      // En desarrollo, permitir cualquier origen
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido para este origen'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser con límite de tamaño
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Anti NoSQL injection
app.use(mongoSanitize());

// Rate limiting AGRESIVO - 50 requests por 10 minutos por IP (prueba de estrés)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Límite: 50 por 10 minutos' },
  skip: (req) => req.ip === '127.0.0.1' // Skip localhost en desarrollo
});
app.use('/api', limiter);

// Rate limiting MUY ESTRICTO para auth - 3 intentos por 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  skipSuccessfulRequests: true,
  message: { error: 'Demasiados intentos de login. Espera 15 minutos' }
});

// Rate limiting para operaciones críticas (crear/actualizar/borrar)
const writeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiadas operaciones de escritura. Límite: 10 por 5 minutos' }
});

// ===========================
// DATABASE CONNECTION
// ===========================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => {
    console.error('❌ Error MongoDB:', err);
    process.exit(1); // Exit si no hay DB
  });

// ===========================
// SCHEMAS CON ÍNDICES
// ===========================
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: { 
    type: String, 
    required: [true, 'Password es requerido'],
    minlength: [6, 'Password debe tener al menos 6 caracteres']
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  createdAt: { type: Date, default: Date.now }
});

// Índices optimizados para búsqueda rápida
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

const carSchema = new mongoose.Schema({
  brand: { 
    type: String, 
    required: [true, 'Marca es requerida'],
    trim: true,
    maxlength: [50, 'Marca muy larga']
  },
  model: { 
    type: String, 
    required: [true, 'Modelo es requerido'],
    trim: true,
    maxlength: [50, 'Modelo muy largo']
  },
  year: { 
    type: Number, 
    required: [true, 'Año es requerido'],
    min: [1900, 'Año inválido'],
    max: [new Date().getFullYear() + 1, 'Año inválido']
  },
  price: { 
    type: Number, 
    required: [true, 'Precio es requerido'],
    min: [0, 'Precio debe ser positivo']
  },
  description: { 
    type: String, 
    required: [true, 'Descripción es requerida'],
    trim: true,
    maxlength: [2000, 'Descripción muy larga']
  },
  imageUrl: { 
    type: String, 
    required: [true, 'URL de imagen es requerida'],
    trim: true
  },
  status: { 
    type: String, 
    enum: ['Disponible', 'Vendido', 'Reservado'], 
    default: 'Disponible' 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  ownerEmail: { 
    type: String, 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Índices compuestos optimizados para queries complejas y performance
carSchema.index({ ownerId: 1, createdAt: -1 });
carSchema.index({ status: 1, price: 1 });
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ year: -1 });
carSchema.index({ price: 1 });
carSchema.index({ createdAt: -1 });
// Text index para búsqueda full-text
carSchema.index({ brand: 'text', model: 'text', description: 'text' });

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Nombre es requerido'],
    trim: true,
    maxlength: [100, 'Nombre muy largo']
  },
  email: { 
    type: String, 
    required: [true, 'Email es requerido'],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  phone: { 
    type: String, 
    required: [true, 'Teléfono es requerido'],
    trim: true,
    maxlength: [20, 'Teléfono muy largo']
  },
  message: { 
    type: String, 
    required: [true, 'Mensaje es requerido'],
    trim: true,
    maxlength: [1000, 'Mensaje muy largo']
  },
  carId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Car' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'attended'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

// Índice para filtrar mensajes pendientes
contactSchema.index({ status: 1, createdAt: -1 });

const User = mongoose.model('User', userSchema);
const Car = mongoose.model('Car', carSchema);
const Contact = mongoose.model('Contact', contactSchema);

// ===========================
// HELPER FUNCTIONS
// ===========================
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Errores de validación', 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ===========================
// AUTHENTICATION MIDDLEWARES
// ===========================
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No autorizado - Token requerido' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(500).json({ message: 'Error de autenticación' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
  }
  next();
};

// ===========================
// ROUTES
// ===========================
app.get('/', (req, res) => {
  res.json({
    message: '🚗 Imperial Luxury Cars API',
    status: 'Online',
    version: '2.0.0',
    security: 'Enhanced',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/verify'],
      cars: ['GET /api/cars', 'POST /api/cars', 'PUT /api/cars/:id', 'DELETE /api/cars/:id'],
      contact: ['POST /api/contact'],
      stats: ['GET /api/stats (admin)']
    }
  });
});

// AUTH ROUTES CON VALIDACIÓN
app.post('/api/auth/register',
  authLimiter,
  [
    body('email')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail()
      .trim(),
    body('password')
      .isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password debe tener mayúsculas, minúsculas y números')
      .trim()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email ya registrado' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      res.status(201).json({
        token,
        user: { id: user._id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  }
);

app.post('/api/auth/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail().trim(),
    body('password').notEmpty().withMessage('Password es requerido').trim()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        token,
        user: { id: user._id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  }
);

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ 
    user: { 
      id: req.user._id, 
      email: req.user.email, 
      role: req.user.role 
    } 
  });
});

// CAR ROUTES CON VALIDACIÓN
app.get('/api/cars', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const cars = await Car.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Car.countDocuments();
    
    res.json({
      cars,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ message: 'Error al obtener vehículos' });
  }
});

app.get('/api/cars/my', authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    res.json(cars);
  } catch (error) {
    console.error('Error al obtener tus vehículos:', error);
    res.status(500).json({ message: 'Error al obtener tus vehículos' });
  }
});

app.get('/api/cars/:id',
  [
    param('id').custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de vehículo inválido');
      }
      return true;
    })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const car = await Car.findById(req.params.id).lean();
      if (!car) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }
      res.json(car);
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      res.status(500).json({ message: 'Error al obtener vehículo' });
    }
  }
);

app.post('/api/cars',
  authMiddleware,
  [
    body('brand').trim().notEmpty().withMessage('Marca es requerida').isLength({ max: 50 }).withMessage('Marca muy larga'),
    body('model').trim().notEmpty().withMessage('Modelo es requerido').isLength({ max: 50 }).withMessage('Modelo muy largo'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Año inválido'),
    body('price').isFloat({ min: 0 }).withMessage('Precio debe ser positivo'),
    body('description').trim().notEmpty().withMessage('Descripción es requerida').isLength({ max: 2000 }).withMessage('Descripción muy larga'),
    body('imageUrl').trim().notEmpty().withMessage('URL de imagen es requerida').isURL().withMessage('URL inválida'),
    body('status').optional().isIn(['Disponible', 'Vendido', 'Reservado']).withMessage('Status inválido')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const carData = { 
        ...req.body, 
        ownerId: req.user._id, 
        ownerEmail: req.user.email 
      };
      
      const car = new Car(carData);
      await car.save();
      
      res.status(201).json(car);
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      res.status(500).json({ message: 'Error al crear vehículo' });
    }
  }
);

app.put('/api/cars/:id',
  authMiddleware,
  [
    param('id').custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de vehículo inválido');
      }
      return true;
    }),
    body('brand').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Marca inválida'),
    body('model').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Modelo inválido'),
    body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Año inválido'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Precio debe ser positivo'),
    body('description').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Descripción inválida'),
    body('imageUrl').optional().trim().isURL().withMessage('URL inválida'),
    body('status').optional().isIn(['Disponible', 'Vendido', 'Reservado']).withMessage('Status inválido')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const car = await Car.findById(req.params.id);
      
      if (!car) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }
      
      if (car.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'No autorizado para editar este vehículo' });
      }
      
      // No permitir cambiar ownerId/ownerEmail
      const { ownerId, ownerEmail, ...updateData } = req.body;
      
      Object.assign(car, updateData);
      car.updatedAt = Date.now();
      await car.save();
      
      res.json(car);
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      res.status(500).json({ message: 'Error al actualizar vehículo' });
    }
  }
);

app.delete('/api/cars/:id',
  authMiddleware,
  [
    param('id').custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de vehículo inválido');
      }
      return true;
    })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const car = await Car.findById(req.params.id);
      
      if (!car) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }
      
      if (car.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'No autorizado para eliminar este vehículo' });
      }
      
      await Car.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      res.status(500).json({ message: 'Error al eliminar vehículo' });
    }
  }
);

// CONTACT ROUTE CON VALIDACIÓN
app.post('/api/contact',
  [
    body('name').trim().notEmpty().withMessage('Nombre es requerido').isLength({ max: 100 }).withMessage('Nombre muy largo'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail().trim(),
    body('phone').trim().notEmpty().withMessage('Teléfono es requerido').isLength({ max: 20 }).withMessage('Teléfono muy largo'),
    body('message').trim().notEmpty().withMessage('Mensaje es requerido').isLength({ max: 1000 }).withMessage('Mensaje muy largo'),
    body('carId').optional().custom((value) => {
      if (value && !isValidObjectId(value)) {
        throw new Error('ID de vehículo inválido');
      }
      return true;
    })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const contact = new Contact(req.body);
      await contact.save();
      res.status(201).json({ message: 'Mensaje enviado exitosamente' });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      res.status(500).json({ message: 'Error al enviar mensaje' });
    }
  }
);

// ADMIN STATS ROUTE
app.get('/api/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [totalCars, availableCars, pendingMessages, totalUsers] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'Disponible' }),
      Contact.countDocuments({ status: 'pending' }),
      User.countDocuments()
    ]);
    
    res.json({ 
      totalCars, 
      availableCars, 
      pendingMessages,
      totalUsers 
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

// ===========================
// STARTUP FUNCTIONS
// ===========================
async function createAdminUser() {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      const admin = new User({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin creado:', process.env.ADMIN_EMAIL);
    }
  } catch (error) {
    console.error('❌ Error creando admin:', error);
  }
}

async function createIndexes() {
  try {
    await User.createIndexes();
    await Car.createIndexes();
    await Contact.createIndexes();
    console.log('✅ Índices de MongoDB verificados');
  } catch (error) {
    // Índices ya existen, normal en reinicio
    if (error.code === 86 || error.codeName === 'IndexKeySpecsConflict') {
      console.log('⚠️  Índices ya existen (normal en reinicio)');
    } else {
      console.error('❌ Error creando índices:', error.message);
    }
  }
}

// ===========================
// ERROR HANDLER
// ===========================
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// ===========================
// SERVER START
// ===========================
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`✅ Servidor escuchando en: http://0.0.0.0:${PORT}`);
  console.log(`🔒 Seguridad: Helmet, Rate Limiting, Validation activados`);
  await createAdminUser();
  await createIndexes();
});

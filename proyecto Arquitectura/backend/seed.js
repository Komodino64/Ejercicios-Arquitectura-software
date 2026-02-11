require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => {
    console.error('❌ Error MongoDB:', err);
    process.exit(1);
  });

// Schemas (igual que en server.js)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: ['Disponible', 'Vendido', 'Reservado'], default: 'Disponible' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Car = mongoose.model('Car', carSchema);

// Datos de ejemplo - Autos de Lujo
const carsData = [
  {
    brand: 'Ferrari',
    model: '488 GTB',
    year: 2024,
    price: 280000,
    description: 'Superdeportivo italiano con motor V8 biturbo de 670 CV. Aceleración 0-100 km/h en 3.0 segundos. Sistema de control de tracción avanzado. Interior en cuero Alcantara.',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Lamborghini',
    model: 'Huracán EVO',
    year: 2024,
    price: 310000,
    description: 'V10 de 640 CV con tracción integral. Aerodinámica activa y sistema de torque vectoring. Pantalla táctil de 8.4 pulgadas. Fibra de carbono en interiores.',
    imageUrl: 'https://images.unsplash.com/photo-1519440985270-993f7c9e1c91?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Porsche',
    model: '911 Turbo S',
    year: 2025,
    price: 225000,
    description: 'Motor boxer de 6 cilindros biturbo con 650 CV. Tracción integral PDK. Sistema deportivo Chrono Package. Asientos deportivos adaptativos plus.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Mercedes-Benz',
    model: 'AMG GT R',
    year: 2024,
    price: 185000,
    description: 'V8 biturbo de 4.0L con 585 CV. Suspensión deportiva AMG RIDE CONTROL. Aerodinámica activa. Interior DINAMICA con costuras amarillas.',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Rolls-Royce',
    model: 'Phantom',
    year: 2025,
    price: 485000,
    description: 'Lujo absoluto con motor V12 de 6.75L. Suspensión neumática autoajustable. Cielos estrellados LED personalizables. Madera maciza de nogal.',
    imageUrl: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Bentley',
    model: 'Continental GT',
    year: 2024,
    price: 240000,
    description: 'W12 TSI de 635 CV. Tracción integral dinámica. Sistema de audio Naim de 2,200 watts. Cuero Mulliner con diamante cosido.',
    imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Aston Martin',
    model: 'DBS Superleggera',
    year: 2024,
    price: 335000,
    description: 'V12 biturbo de 715 CV. Carrocería de aluminio aeroespacial. Sistema de escape deportivo activo. Interior Bond lifestyle.',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    status: 'Reservado'
  },
  {
    brand: 'McLaren',
    model: '720S',
    year: 2024,
    price: 315000,
    description: 'V8 biturbo de 4.0L con 720 CV. Chasis MonoCell de carbono. Puertas dihedral. Sistema Proactive Chassis Control II.',
    imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
    status: 'Disponible'
  },
  {
    brand: 'BMW',
    model: 'M8 Competition',
    year: 2024,
    price: 155000,
    description: 'V8 biturbo de 625 CV con sistema M xDrive. Diferencial M activo. Suspensión deportiva adaptativa M. Asientos M Carbon.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Audi',
    model: 'R8 V10 Performance',
    year: 2024,
    price: 198000,
    description: 'Motor V10 atmosférico de 620 CV. Chasis Audi Space Frame de aluminio. Tracción quattro. Virtual Cockpit plus.',
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Bugatti',
    model: 'Chiron',
    year: 2024,
    price: 3200000,
    description: 'W16 quad-turbo de 1,500 CV. Velocidad máxima limitada a 420 km/h. Interior de lujo artesanal. Producción limitada.',
    imageUrl: 'https://images.unsplash.com/photo-1566024287286-457247b70310?w=800',
    status: 'Vendido'
  },
  {
    brand: 'Maserati',
    model: 'MC20',
    year: 2024,
    price: 235000,
    description: 'V6 Nettuno biturbo de 630 CV. Puertas mariposa. Chasis de fibra de carbono. Tecnología F1 adaptada a calle.',
    imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Pagani',
    model: 'Huayra',
    year: 2024,
    price: 2800000,
    description: 'V12 AMG biturbo de 730 CV. Carrocería carbo-titanium. Interior artesanal italiano. Sistema activo de aerodinámica.',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
    status: 'Reservado'
  },
  {
    brand: 'Jaguar',
    model: 'F-Type R',
    year: 2024,
    price: 125000,
    description: 'V8 sobrealimentado de 575 CV. Diseño británico clásico deportivo. Sistema de escape deportivo Quickshift. All-Wheel Drive.',
    imageUrl: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Lexus',
    model: 'LC 500',
    year: 2024,
    price: 98000,
    description: 'V8 atmosférico de 5.0L con 471 CV. Diseño japonés Takumi. Sistema híbrido multi-stage. Interior Yamaha premium.',
    imageUrl: 'https://images.unsplash.com/photo-1555353540-064b9c400f25?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Corvette',
    model: 'C8 Z06',
    year: 2025,
    price: 115000,
    description: 'V8 atmosférico de 5.5L con 670 CV. Motor central. Suspensión Magnetic Ride Control 4.0. Modo Track con telemetría.',
    imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Tesla',
    model: 'Roadster',
    year: 2025,
    price: 250000,
    description: 'Superdeportivo eléctrico con 0-100 km/h en 1.9 segundos. Autonomía de 1,000 km. Tres motores eléctricos. Tecnología SpaceX.',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Lotus',
    model: 'Evija',
    year: 2024,
    price: 2300000,
    description: 'Hipercoche eléctrico de 2,000 CV. Chasis de fibra de carbono. Aerodinámica extrema. Producción limitada a 130 unidades.',
    imageUrl: 'https://images.unsplash.com/photo-1583267746897-f3327ef2deba?w=800',
    status: 'Reservado'
  },
  {
    brand: 'Koenigsegg',
    model: 'Jesko',
    year: 2024,
    price: 3000000,
    description: 'V8 biturbo de 1,600 CV con E85. Transmisión Light Speed de 9 velocidades. Aerodinámica activa. Tecnología de fibra de carbono.',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    status: 'Vendido'
  },
  {
    brand: 'Rimac',
    model: 'Nevera',
    year: 2024,
    price: 2400000,
    description: 'Hipercoche eléctrico croata de 1,914 CV. 0-100 km/h en 1.85 segundos. Batería de 120 kWh. Torque vectoring en las 4 ruedas.',
    imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Nissan',
    model: 'GT-R NISMO',
    year: 2024,
    price: 215000,
    description: 'V6 biturbo de 3.8L con 600 CV. Tecnología ATTESA E-TS Pro. Aerodinámica de competición. Interior Recaro carbon-backed.',
    imageUrl: 'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Acura',
    model: 'NSX Type S',
    year: 2024,
    price: 175000,
    description: 'Híbrido deportivo con 600 CV combinados. Sistema híbrido de triple motor. Chasis de aluminio espacial. Edición final limitada.',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-34574d5vigc2?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Cadillac',
    model: 'CT5-V Blackwing',
    year: 2024,
    price: 95000,
    description: 'V8 sobrealimentado de 6.2L con 668 CV. Tracción trasera. Transmisión manual disponible. Lujo americano deportivo.',
    imageUrl: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Genesis',
    model: 'G80 Sport',
    year: 2025,
    price: 78000,
    description: 'Sedán de lujo coreano con V6 biturbo de 375 CV. Diseño Crest Grille. Interior cuero Nappa premium. Tecnología de nivel 2+.',
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Alfa Romeo',
    model: 'Giulia Quadrifoglio',
    year: 2024,
    price: 82000,
    description: 'V6 biturbo de 2.9L con 510 CV. Chasis 50/50 perfecto. Sistema DNA Pro con Race mode. Interior italiano deportivo.',
    imageUrl: 'https://images.unsplash.com/photo-1606016159991-4397e9be5767?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Dodge',
    model: 'Challenger SRT Demon 170',
    year: 2024,
    price: 125000,
    description: 'V8 sobrealimentado de 6.2L con 1,025 CV. Muscle car más potente. 0-100 km/h en 1.66 segundos. Edición final limitada.',
    imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5f7f2c304?w=800',
    status: 'Reservado'
  },
  {
    brand: 'Ford',
    model: 'Mustang Shelby GT500',
    year: 2024,
    price: 95000,
    description: 'V8 sobrealimentado de 5.2L con 760 CV. Transmisión DCT de 7 velocidades. Carbon Fiber Track Pack. Ícono americano.',
    imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5f7f2c304?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Aston Martin',
    model: 'Vantage F1 Edition',
    year: 2025,
    price: 165000,
    description: 'V8 biturbo AMG de 535 CV. Edición limitada Safety Car F1. Aerodinámica mejorada. Interior Lime Essence.',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Porsche',
    model: 'Taycan Turbo S',
    year: 2024,
    price: 195000,
    description: 'Deportivo eléctrico de 761 CV. Batería de 93.4 kWh. Suspensión neumática adaptativa. 0-100 km/h en 2.8 segundos.',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
    status: 'Disponible'
  },
  {
    brand: 'Mercedes-AMG',
    model: 'One',
    year: 2024,
    price: 2700000,
    description: 'Hipercoche con tecnología F1. Motor híbrido V6 turbo de 1,063 CV. Producción limitada. Sistema KERS. Aerodinámica activa.',
    imageUrl: 'https://images.unsplash.com/photo-1599912027806-296c0c584c58?w=800',
    status: 'Vendido'
  },
  {
    brand: 'BMW',
    model: 'i8 Roadster',
    year: 2024,
    price: 155000,
    description: 'Híbrido deportivo enchufable de 369 CV. Diseño futurista con puertas ala de gaviota. Modo 100% eléctrico. Techo descapotable.',
    imageUrl: 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800',
    status: 'Disponible'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de base de datos...\n');

    // 1. Verificar/crear admin
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      admin = new User({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin creado:', admin.email);
    } else {
      console.log('✅ Admin ya existe:', admin.email);
    }

    // 2. Verificar si ya hay autos
    const existingCarsCount = await Car.countDocuments();
    
    if (existingCarsCount > 0) {
      console.log(`\n⚠️  Ya existen ${existingCarsCount} vehículos en la base de datos.`);
      console.log('¿Deseas eliminarlos y crear nuevos? (Ctrl+C para cancelar)\n');
      
      // Esperar 3 segundos antes de continuar
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Eliminar autos existentes
      await Car.deleteMany({});
      console.log('🗑️  Vehículos anteriores eliminados\n');
    }

    // 3. Crear autos de ejemplo
    console.log('📦 Creando vehículos de ejemplo...\n');
    
    for (const carData of carsData) {
      const car = new Car({
        ...carData,
        ownerId: admin._id,
        ownerEmail: admin.email
      });
      await car.save();
      console.log(`✅ ${carData.brand} ${carData.model} - $${carData.price.toLocaleString()} - ${carData.status}`);
    }

    console.log(`\n✅ Seed completado exitosamente!`);
    console.log(`📊 Total de vehículos creados: ${carsData.length}`);
    console.log(`\n🌐 Accede a la aplicación:`);
    console.log(`   Frontend: http://localhost:8080`);
    console.log(`   Backend:  http://localhost:5000`);
    console.log(`\n🔐 Credenciales admin:`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error en seed:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seedDatabase();

// ============================================
// 👨‍💼 PANEL DE ADMINISTRACIÓN (REST API)
// ============================================

// Verificar que el usuario sea admin
(async function() {
    try {
        await requireAdmin();
        
        // Verificar si hay parámetro ?edit=ID en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const editCarId = urlParams.get('edit');
        
        if (editCarId) {
            // Esperar a que se cargue la página y luego abrir el modal de edición
            setTimeout(() => {
                editCar(editCarId);
                // Limpiar el parámetro de la URL sin recargar
                window.history.replaceState({}, document.title, 'admin.html');
            }, 500);
        }
    } catch (error) {
        // Ya redirige en requireAdmin()
    }
})();

// ============ ESTADÍSTICAS ============
async function updateStats() {
    try {
        const stats = await API.stats.get();
        document.getElementById('totalCars').textContent = stats.totalCars || 0;
        document.getElementById('availableCars').textContent = stats.availableCars || 0;
        document.getElementById('pendingMessages').textContent = stats.pendingMessages || 0;
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

updateStats();

// ============ CLOUDINARY UPLOAD WIDGET ============
let uploadedImageUrl = '';

const myWidget = cloudinary.createUploadWidget(
    {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
        maxFileSize: 5000000, // 5MB
        folder: 'imperial-luxury-cars',
        theme: 'minimal'
    },
    (error, result) => {
        if (!error && result && result.event === 'success') {
            uploadedImageUrl = result.info.secure_url;
            document.getElementById('imageUrl').value = uploadedImageUrl;
            
            // Mostrar preview
            document.getElementById('imagePreview').innerHTML = `
                <p style="color: #10b981; margin: 10px 0; font-weight: 600;">✅ Imagen cargada exitosamente</p>
                <img src="${uploadedImageUrl}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            `;
        }
        
        if (error) {
            console.error('Error uploading:', error);
            alert('❌ Error subiendo imagen: ' + error.message);
        }
    }
);

document.getElementById('uploadWidget').addEventListener('click', () => {
    myWidget.open();
});

// ============ GESTIÓN DE CARROS ============
async function loadCars() {
    try {
        const cars = await API.cars.getAll();
        
        document.getElementById('carsLoading').classList.add('hidden');
        document.getElementById('carsTableContainer').classList.remove('hidden');
        
        const tbody = document.getElementById('carsTableBody');
        tbody.innerHTML = '';
        
        if (cars.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">No hay vehículos registrados</td></tr>';
            return;
        }
        
        cars.forEach(car => {
            const ownerDisplay = car.ownerEmail ? car.ownerEmail.split('@')[0] : 'Desconocido';
            tbody.innerHTML += `
                <tr>
                    <td><img src="${car.imageUrl}" class="table-img" alt="${car.brand}"></td>
                    <td><strong>${car.brand} ${car.model}</strong></td>
                    <td>${car.year}</td>
                    <td>$${car.price.toLocaleString()}</td>
                    <td><span class="badge ${car.status.toLowerCase()}">${car.status}</span></td>
                    <td style="font-size: 0.9em; color: #64748b;">${ownerDisplay}</td>
                    <td class="action-buttons">
                        <button onclick="editCar('${car._id}')" class="btn-edit">✏️</button>
                        <button onclick="deleteCar('${car._id}', '${car.brand} ${car.model}')" class="btn-delete">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error cargando carros:', error);
        document.getElementById('carsLoading').innerHTML = '<p style="color: #ef4444;">❌ Error cargando vehículos</p>';
    }
}

loadCars();

// Mostrar modal para agregar
function showAddCarModal() {
    document.getElementById('modalTitle').textContent = '➕ Agregar Vehículo';
    document.getElementById('carForm').reset();
    document.getElementById('carDocId').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('carModal').classList.remove('hidden');
    document.getElementById('carModal').style.display = 'flex';
}

// Cerrar modal
function closeCarModal() {
    document.getElementById('carModal').classList.add('hidden');
    document.getElementById('carModal').style.display = 'none';
}

// Editar carro
async function editCar(carId) {
    try {
        const car = await API.cars.getOne(carId);
        
        document.getElementById('modalTitle').textContent = '✏️ Editar Vehículo';
        document.getElementById('carDocId').value = carId;
        document.getElementById('brand').value = car.brand;
        document.getElementById('model').value = car.model;
        document.getElementById('year').value = car.year;
        document.getElementById('price').value = car.price;
        document.getElementById('description').value = car.description;
        document.getElementById('status').value = car.status;
        document.getElementById('imageUrl').value = car.imageUrl;
        uploadedImageUrl = car.imageUrl;
        
        document.getElementById('imagePreview').innerHTML = `
            <p style="color: #10b981; margin: 10px 0; font-weight: 600;">📸 Imagen actual:</p>
            <img src="${car.imageUrl}" alt="Current" style="max-width: 100%; max-height: 200px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        `;
        
        document.getElementById('carModal').classList.remove('hidden');
        document.getElementById('carModal').style.display = 'flex';
        
    } catch (error) {
        console.error('Error cargando carro:', error);
        alert('❌ ' + error.message);
    }
}

// Eliminar carro
async function deleteCar(carId, carName) {
    if (!confirm(`¿Estás seguro de eliminar "${carName}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    try {
        await API.cars.delete(carId);
        alert('✅ Vehículo eliminado exitosamente');
        loadCars(); // Recargar
        updateStats(); // Actualizar estadísticas
    } catch (error) {
        console.error('Error eliminando carro:', error);
        alert('❌ ' + error.message);
    }
}

// Guardar carro (crear o actualizar)
document.getElementById('carForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Guardando...';
    
    try {
        const carData = {
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            price: parseInt(document.getElementById('price').value),
            description: document.getElementById('description').value,
            status: document.getElementById('status').value,
            imageUrl: document.getElementById('imageUrl').value
        };
        
        const carId = document.getElementById('carDocId').value;
        
        if (carId) {
            // Actualizar
            await API.cars.update(carId, carData);
            alert('✅ Vehículo actualizado exitosamente');
        } else {
            // Crear nuevo
            await API.cars.create(carData);
            alert('✅ Vehículo agregado exitosamente');
        }
        
        closeCarModal();
        loadCars(); // Recargar
        updateStats(); // Actualizar estadísticas
        
    } catch (error) {
        console.error('Error guardando carro:', error);
        alert('❌ ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Guardar';
    }
});

// ============ MENSAJES DE CONTACTO ============
// NOTA: Backend no tiene endpoint específico para mensajes aún
// Por ahora solo mostrar mensaje informativo
document.getElementById('messagesLoading').classList.add('hidden');
document.getElementById('messagesContainer').classList.remove('hidden');
document.getElementById('messagesContainer').innerHTML = `
    <p style="text-align: center; padding: 40px; color: #64748b;">
        📨 Los mensajes de contacto se están guardando en la base de datos.<br>
        <small>Próximamente: panel de gestión de mensajes completo</small>
    </p>
`;

// Cerrar modal al hacer clic fuera
document.getElementById('carModal').addEventListener('click', (e) => {
    if (e.target.id === 'carModal') {
        closeCarModal();
    }
});

// ============================================
// 📋 MIS ANUNCIOS - Gestión de publicaciones propias (REST API)
// ============================================

// Verificar que el usuario esté autenticado
(async function() {
    try {
        const user = await requireAuth();
        document.getElementById('authCheck').classList.add('hidden');
        document.getElementById('myAdsSection').classList.remove('hidden');
        loadMyCars();
        
        // Verificar si hay parámetro ?edit=ID en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const editCarId = urlParams.get('edit');
        
        if (editCarId) {
            // Esperar a que se cargue la página y luego abrir el modal de edición
            setTimeout(() => {
                editCar(editCarId);
                // Limpiar el parámetro de la URL sin recargar
                window.history.replaceState({}, document.title, 'my-ads.html');
            }, 500);
        }
    } catch (error) {
        // Ya redirige en requireAuth()
    }
})();

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

// ============ CARGAR MIS CARROS ============
async function loadMyCars() {
    try {
        const cars = await API.cars.getMy();
        
        document.getElementById('carsLoading').classList.add('hidden');
        document.getElementById('carsTableContainer').classList.remove('hidden');
        
        const tbody = document.getElementById('carsTableBody');
        tbody.innerHTML = '';
        
        if (cars.length === 0) {
            document.getElementById('carsTableContainer').classList.add('hidden');
            document.getElementById('noCars').classList.remove('hidden');
            return;
        }
        
        document.getElementById('noCars').classList.add('hidden');
        
        cars.forEach(car => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${car.imageUrl}" class="table-img" alt="${car.brand}"></td>
                    <td><strong>${car.brand} ${car.model}</strong></td>
                    <td>${car.year}</td>
                    <td>$${car.price.toLocaleString()}</td>
                    <td><span class="badge ${car.status.toLowerCase()}">${car.status}</span></td>
                    <td class="action-buttons">
                        <button onclick="editCar('${car._id}')" class="btn-edit">✏️</button>
                        <button onclick="deleteCar('${car._id}', '${car.brand} ${car.model}')" class="btn-delete">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error cargando mis carros:', error);
        document.getElementById('carsLoading').innerHTML = '<p style="color: #ef4444;">❌ Error cargando tus anuncios</p>';
    }
}

// Mostrar modal para agregar
function showAddCarModal() {
    document.getElementById('modalTitle').textContent = '➕ Publicar Vehículo';
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
        
        document.getElementById('modalTitle').textContent = '✏️ Editar Mi Anuncio';
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
    if (!confirm(`¿Estás seguro de eliminar tu anuncio "${carName}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    try {
        await API.cars.delete(carId);
        alert('✅ Anuncio eliminado exitosamente');
        loadMyCars(); // Recargar lista
    } catch (error) {
        console.error('Error eliminando carro:', error);
        alert('❌ ' + error.message);
    }
}

// Guardar carro (crear o actualizar)
document.getElementById('carForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
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
            alert('✅ Anuncio actualizado exitosamente');
        } else {
            // Crear nuevo
            await API.cars.create(carData);
            alert('✅ Anuncio publicado exitosamente');
        }
        
        closeCarModal();
        loadMyCars(); // Recargar lista
        
    } catch (error) {
        console.error('Error guardando carro:', error);
        alert('❌ ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Cerrar modal al hacer clic fuera
document.getElementById('carModal').addEventListener('click', (e) => {
    if (e.target.id === 'carModal') {
        closeCarModal();
    }
});

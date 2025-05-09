<?php
// Configuración de CORS
header("Access-Control-Allow-Origin: *"); // Reemplaza * con tu dominio en producción
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Manejo de solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verificar que sea una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Recibir datos JSON del cuerpo de la solicitud
$json_data = file_get_contents('php://input');
$updated_data = json_decode($json_data, true);

if (!is_array($updated_data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos JSON inválidos']);
    exit;
}

// Guardar los datos actualizados en el archivo JSON
$firebase_info_file = 'firebase_uploads.json';
if (!file_put_contents($firebase_info_file, json_encode($updated_data))) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar los datos actualizados']);
    exit;
}

// Respuesta exitosa
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Estado de las imágenes actualizado correctamente'
]);
?>
<?php
require 'vendor/autoload.php';

use Google\Cloud\Storage\StorageClient;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image'])) {
        $image = $_FILES['image'];
        $originalName = basename($image['name']);

        // Extraer ID del nombre del archivo (ej: 743 de 743.jpg)
        $id = pathinfo($originalName, PATHINFO_FILENAME); // devuelve '743'

        // Construir la ruta destino en Firebase: '743/743.jpg'
        $firebasePath = $id . '/' . $originalName;

        // Configura tu clave y bucket de Firebase
        $storage = new StorageClient([
            'keyFilePath' => __DIR__ . '../src/firebase_settings/firebase,js'
        ]);
        $bucket = $storage->bucket('gs://esp-database-a23e4.firebasestorage.app');

        // Subir el archivo
        $object = $bucket->upload(
            fopen($image['tmp_name'], 'r'),
            [
                'name' => $firebasePath,
                'predefinedAcl' => 'publicRead' // puedes quitarlo si quieres acceso privado
            ]
        );

        echo "Imagen subida exitosamente a: $firebasePath";
    } else {
        echo "No se recibió ninguna imagen.";
    }
} else {
    echo "Usa POST para subir la imagen.";
}

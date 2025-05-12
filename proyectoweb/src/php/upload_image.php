<?php
require_once 'vendor/kreait/firebase-php/src/Firebase/Factory.php';
require_once 'vendor/kreait/firebase-php/src/Firebase/Firebase.php';
require_once 'vendor/kreait/firebase-php/src/Firebase/Storage.php';
require_once 'vendor/kreait/firebase-php/src/Firebase/ServiceAccount.php';
require_once 'vendor/google/cloud-storage/src/StorageClient.php';
require_once 'vendor/google/cloud-storage/src/Storage/Bucket.php';
require_once 'vendor/google/cloud-storage/src/Storage/StorageObject.php';

use \Kreait\Firebase\Factory;
use \Kreait\Firebase\ServiceAccount;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image']) && isset($_POST['directoryName']) && isset($_POST['imageName'])) {
        $image = $_FILES['image'];
        $directoryName = $_POST['directoryName'];
        $imageName = $_POST['imageName'];

        // Construir la ruta destino en Firebase: 'nombreDirectorio/nombreImagen'
        $firebasePath = $directoryName . '/' . $imageName;

        // Inicializa Firebase
        $factory = (new Factory)
            ->withServiceAccount(__DIR__ . '/../src/firebase_settings/firebase.json') // Asegúrate de que esta ruta sea correcta
            ->withDatabaseUri('https://esp-database-a23e4-default-rtdb.firebaseio.com/'); // Reemplaza con la URL de tu Realtime Database si la usas

        $storage = $factory->getStorage();
        $bucket = $storage->getBucket();

        // Crear la carpeta si no existe (Firebase Storage lo hace implícitamente al subir un archivo con ruta de carpeta)

        // Subir el archivo
        $object = $bucket->upload(
            fopen($image['tmp_name'], 'r'),
            [
                'name' => $firebasePath,
                'predefinedAcl' => 'publicRead' // Puedes quitarlo si quieres acceso privado
            ]
        );

        echo "Imagen subida exitosamente a: $firebasePath";
    } else {
        echo "No se recibió ninguna imagen.";
    }
} else {
    echo "Método no permitido. Usa POST para subir la imagen.";
}

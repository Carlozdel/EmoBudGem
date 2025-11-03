#!/bin/bash

echo "🔥 Iniciando instalación limpia de Emo-Bud con Tailwind..."

# Limpieza total
rm -rf node_modules package-lock.json tailwind.config.js postcss.config.js input.css output.css
npm cache clean --force

# Inicializa proyecto
npm init -y

# Instala Tailwind y herramientas necesarias
npm install -D tailwindcss postcss autoprefixer

# Verifica instalación
if [ ! -f "./node_modules/.bin/tailwindcss" ]; then
  echo "❌ Tailwind no se instaló correctamente. Abortando."
  exit 1
fi

# Crea configuración
npx tailwindcss init -p

# Crea archivos base
echo '@tailwind base;
@tailwind components;
@tailwind utilities;' > input.css

echo 'module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
}' > tailwind.config.js

echo 'module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}' > postcss.config.js

echo '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Emo-Bud</title>
  <link href="output.css" rel="stylesheet">
</head>
<body class="bg-gray-100 text-center p-10">
  <h1 class="text-3xl font-bold text-indigo-600">Emo-Bud está vivo 🧠✨</h1>
</body>
</html>' > index.html

# Compila CSS
npx tailwindcss -i ./input.css -o ./output.css --watch &
echo "✅ Emo-Bud listo. Tailwind está observando cambios en input.css"
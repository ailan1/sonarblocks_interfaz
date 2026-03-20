// extract-hex-template.js
const fs = require('fs');
const path = require('path');

function createTemplateFromRealHex(realHexPath, outputName = 'template') {
    try {
        console.log(`📂 Leyendo: ${realHexPath}`);
        const hexContent = fs.readFileSync(realHexPath, 'utf8');
        const lines = hexContent.split('\n').filter(l => l.trim());
        
        console.log(`📊 Estadísticas:`);
        console.log(`  - Líneas totales: ${lines.length}`);
        console.log(`  - Tamaño: ${hexContent.length} bytes`);
        
        // Analizar estructura
        let dataLines = 0;
        let eofLines = 0;
        let otherLines = 0;
        
        lines.forEach(line => {
            if (line.startsWith(':')) {
                const type = parseInt(line.substr(7, 2), 16);
                if (type === 0) dataLines++;
                else if (type === 1) eofLines++;
                else otherLines++;
            }
        });
        
        console.log(`  - Líneas de datos: ${dataLines}`);
        console.log(`  - Líneas especiales: ${otherLines}`);
        console.log(`  - EOF: ${eofLines}`);
        
        // Crear template modificable
        const templateLines = [];
        
        // 1. Mantener cabecera y metadata
        for (let i = 0; i < Math.min(50, lines.length); i++) {
            templateLines.push(lines[i]);
        }
        
        // 2. Añadir marcador de inyección
        templateLines.push('::INJECTION_POINT::');
        
        // 3. Mantener padding y EOF
        for (let i = lines.length - 20; i < lines.length; i++) {
            if (i > 0 && lines[i]) {
                templateLines.push(lines[i]);
            }
        }
        
        // Guardar template
        const outputPath = path.join(__dirname, 'templates', `${outputName}.hex`);
        fs.writeFileSync(outputPath, templateLines.join('\n'));
        
        console.log(`✅ Template guardado en: ${outputPath}`);
        console.log(`📝 Líneas en template: ${templateLines.length}`);
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

// Uso: node extract-hex-template.js <archivo.hex>
if (require.main === module) {
    const hexFile = process.argv[2];
    
    if (!hexFile) {
        console.log('Uso: node extract-hex-template.js <archivo-hex-real.hex>');
        console.log('Ejemplo: node extract-hex-template.js microbit-game.hex');
        process.exit(1);
    }
    
    if (!fs.existsSync(hexFile)) {
        console.error(`Archivo no encontrado: ${hexFile}`);
        process.exit(1);
    }
    
    createTemplateFromRealHex(hexFile, 'real-template');
}
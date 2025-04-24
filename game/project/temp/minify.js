const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');

// Paths
const jsDir = path.join(__dirname, '../game/js');
const cssDir = path.join(__dirname, '../game/css');
const minifiedJsDir = path.join(__dirname, '../game/js/min');
const minifiedCssDir = path.join(__dirname, '../game/css/min');

// Create directories if they don't exist
if (!fs.existsSync(minifiedJsDir)) {
  fs.mkdirSync(minifiedJsDir, { recursive: true });
}

if (!fs.existsSync(minifiedCssDir)) {
  fs.mkdirSync(minifiedCssDir, { recursive: true });
}

// Minify JavaScript files
const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
jsFiles.forEach(file => {
  const filePath = path.join(jsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const result = UglifyJS.minify(content);
  if (result.error) {
    console.error(`Error minifying ${file}:`, result.error);
    return;
  }
  
  const minifiedPath = path.join(minifiedJsDir, file);
  fs.writeFileSync(minifiedPath, result.code);
  console.log(`Minified ${file} -> ${path.relative(jsDir, minifiedPath)}`);
});

// Minify CSS files
const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
cssFiles.forEach(file => {
  const filePath = path.join(cssDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const result = new CleanCSS().minify(content);
  if (result.errors.length > 0) {
    console.error(`Error minifying ${file}:`, result.errors);
    return;
  }
  
  const minifiedPath = path.join(minifiedCssDir, file);
  fs.writeFileSync(minifiedPath, result.styles);
  console.log(`Minified ${file} -> ${path.relative(cssDir, minifiedPath)}`);
});

console.log('Minification complete!');
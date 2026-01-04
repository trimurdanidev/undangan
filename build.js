const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (fs.existsSync(src)) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
    }
  }
}

// Clean dist
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// Build JS
console.log('Building JavaScript...');
execSync('npx esbuild js/guest.js --bundle --outfile=dist/bundle.js --minify', { 
  stdio: 'inherit' 
});

// Copy files
console.log('Copying files...');
if (fs.existsSync('index.html')) {
  fs.copyFileSync('index.html', 'dist/index.html');
  console.log('✓ Copied index.html');
}

if (fs.existsSync('css')) {
  copyRecursive('css', 'dist/css');
  console.log('✓ Copied css/');
}

if (fs.existsSync('assets')) {
  copyRecursive('assets', 'dist/assets');
  console.log('✓ Copied assets/');
}

console.log('\n✓ Build complete!');
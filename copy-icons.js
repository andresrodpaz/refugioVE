const fs = require('fs');
const path = require('path');

const srcApple = path.join(__dirname, 'public', 'apple-icon.png');
const src32 = path.join(__dirname, 'public', 'icon-dark-32x32.png');

const dest192 = path.join(__dirname, 'public', 'icon-192.png');
const dest512 = path.join(__dirname, 'public', 'icon-512.png');
const destFavicon = path.join(__dirname, 'public', 'favicon.ico');

try {
  if (fs.existsSync(srcApple)) {
    fs.copyFileSync(srcApple, dest192);
    fs.copyFileSync(srcApple, dest512);
    console.log('Successfully copied apple-icon to icon-192 and icon-512');
  } else {
    console.warn('Source apple-icon.png not found');
  }

  if (fs.existsSync(src32)) {
    fs.copyFileSync(src32, destFavicon);
    console.log('Successfully copied icon-dark-32x32 to favicon.ico');
  } else {
    console.warn('Source icon-dark-32x32.png not found');
  }
} catch (err) {
  console.error('Error copying files:', err);
}

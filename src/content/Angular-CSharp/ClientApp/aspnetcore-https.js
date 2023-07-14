// This script sets up HTTPS for the application using the ASP.NET Core HTTPS certificate
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : process.env.npm_package_name;

if (!certificateName) {
  console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
  process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

let certFileAge = Number.MAX_SAFE_INTEGER;
let keyFileAge = Number.MAX_SAFE_INTEGER;

try {
  certFileAge = fileAgeInHours(certFilePath);
  keyFileAge = fileAgeInHours(keyFilePath);
} catch {
  // one of the files not exists
}

const  FILE_MAX_TTL = 1.0;    // hours

// re-run the tool if any of the checked files not exists or created more than FILE_MAX_TTL hour(s) ago
if (certFileAge > FILE_MAX_TTL || keyFileAge > FILE_MAX_TTL) {
  spawn('dotnet', [
    'dev-certs',
    'https',
    '--export-path',
    certFilePath,
    '--format',
    'Pem',
    '--no-password',
  ], { stdio: 'inherit', })
  .on('exit', (code) => process.exit(code));
}

// how many hours lapsed since this file was modified last time?
function fileAgeInHours(filePath) {
  const { mtimeMs } = fs.statSync(filePath);
  const nowMs = (new Date()).getTime();
  return ((nowMs - mtimeMs) / 1000) / 3600;  
};

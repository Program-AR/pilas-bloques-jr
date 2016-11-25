VERSION=$(shell scripts/obtenerVersion.sh)
NOMBRE=pilas-bloques-jr

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m
L=[01;30m

BIN_EMBER=./node_modules/ember-cli/bin/ember
BIN_ELECTRON=node_modules/.bin/electron
BIN_ELECTRON_PACKAGER=node_modules/.bin/electron-packager
BIN_TSC=./node_modules/typescript/bin/tsc

VERSION_ELECTRON="1.4.5"

npm_config_loglevel="warn"

comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${G}${NOMBRE}${N} - ${Y} versión ${VERSION}${N}"
	@echo ""
	@echo "  ${Y}Para desarrolladores de la aplicación ember${N}"
	@echo ""
	@echo "    ${G}iniciar${N}         Instala dependencias."
	@echo "    ${G}compilar${N}        Genera los archivos compilados."
	@echo "    ${G}compilar_live${N}   Compila de forma contínua."
	@echo "    ${G}test_travis${N}     Ejecuta las mismas pruebas que travis."
	@echo ""
	@echo "  ${Y}Para desarrolladores de pilasweb${N}"
	@echo ""
	@echo "    ${G}compilar_extras${N}      Compila la extensión de pilasweb en public/libs."
	@echo "    ${G}compilar_extras_live${N} Compila de forma contínua la extensión de pilasweb."
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version_patch${N}     Genera una versión (0.0.PATCH)."
	@echo "    ${G}version_minor${N}     Genera una versión (0.MINOR.0)."
	@echo "    ${G}version_major${N}     Genera una versión (MAJOR.0.0)."
	@echo ""
	@echo "    ${G}binarios${N}          Genera los binarios con electron."
	@echo ""
	@echo ""


iniciar:
	@echo "${G}instalando dependencias ...${N}"
	@npm install
	@bower install --allow-root

compilar:
	${BIN_EMBER} build --environment=electron

compilar_production:
	${BIN_EMBER} build --environment=electron-production

compilar_live:
	${BIN_EMBER} build --watch --environment=electron

version_patch:
	${BIN_EMBER} release

version_minor:
	${BIN_EMBER} release --minor

version_major:
	${BIN_EMBER} release --major

test_travis:
	${BIN_EMBER} test

compilar_extras:
	${BIN_TSC} --pretty

compilar_extras_live:
	${BIN_TSC} --watch --pretty

electron:
	@echo ""
	@echo "${G}CIUDADO, para que esto funcione tendrías que ejecutar previamente:${N}"
	@echo ""
	@echo "   ${G}make compilar o make compilar_live${N}"
	@echo ""
	${BIN_ELECTRON} .

binarios: compilar_production _preparar_electron _compilar_electron_osx _compilar_electron_win32
	@echo ""
	@echo "${G}Listo, los binarios se generaron en el directorio 'binarios':${N}"
	@echo ""
	@echo "${G}   binarios/pilas-bloques-${VERSION}.dmg${N}"
	@echo "${G}   binarios/pilas-bloques-${VERSION}.exe${N}"
	@echo ""

_preparar_electron:
	@echo "${G}Preparando directorio dist para funcionar con electron...${N}"
	@sed 's/VERSION/${VERSION}/g' extras/package.json > dist/package.json
	@sed 's/dist\/index.html/index.html/g' electron.js > dist/electron.js

_compilar_electron_osx:
	@echo "${G}Iniciando compilación a electron a OSX ...${N}"
	rm -f binarios/${NOMBRE}-${VERSION}.dmg
	@echo "${G}Generando el binario .app ...${N}"
	${BIN_ELECTRON_PACKAGER} dist "${NOMBRE}" --app-version=${VERSION} --platform=darwin --arch=all --icon=extras/icono.icns --version=${VERSION_ELECTRON} --ignore=node_modules --ignore=bower_components --out=binarios --overwrite
	@echo "${G}Comprimiendo el binario a formato .dmg ...${N}"
	hdiutil create binarios/${NOMBRE}-${VERSION}.dmg -srcfolder ./binarios/${NOMBRE}-darwin-x64/${NOMBRE}.app -size 200mb

_compilar_electron_win32:
	@echo "${G}Iniciando compilación a electron a Windows...${N}"
	${BIN_ELECTRON_PACKAGER} dist "${NOMBRE}" --app-version=${VERSION} --platform=win32 --arch=ia32 --icon=extras/icono.ico --version=${VERSION_ELECTRON} --ignore=node_modules --ignore=bower_components --out=binarios --overwrite
	@echo "${G}Generando instalador para windows...${N}"
	cp extras/instalador.nsi binarios/${NOMBRE}-win32-ia32/
	cd binarios/${NOMBRE}-win32-ia32/; makensis instalador.nsi
	@mv binarios/${NOMBRE}-win32-ia32/${NOMBRE}-instalador.exe binarios/${NOMBRE}-${VERSION}.exe

test: test_travis

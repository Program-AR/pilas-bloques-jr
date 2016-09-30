all:
	@echo "Ingrese un comando..."

actualizar_version_web:
	ember surge --environment development

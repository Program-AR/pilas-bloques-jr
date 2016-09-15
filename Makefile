all:
	@echo "Ingrese un comando..."

actualizar_gitpages:
	ember github-pages:commit --message "Update gitpages."
	git push origin gh-pages:gh-pages
	@echo "https://hugoruscitti.github.io/pilas-bloques-jr/"

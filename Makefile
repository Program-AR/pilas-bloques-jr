all:
	@echo "Ingrese un comando..."

actualizar_gitpages:
	ember github-pages:commit --message "Update gitpages."
	git push origin gh-pages:gh-pages
	@echo "https://hugoruscitti.github.io/pilas-bloques-jr/"

limpiar_gitpages:
	git checkout --orphan gh-pages && rm -rf `bash -c "ls -a | grep -vE '\.gitignore|\.git|node_modules|bower_components|(^[.]{1,2}/?$)'"` && git add -A && git commit -m "initial gh-pages commit"

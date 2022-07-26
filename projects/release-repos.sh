CPATH=`pwd`

cd ..
ng build --prod --project=nova-repos
cp ../dist/nova-repos/index.html ../dist/nova-repos/errno-404
qshell account EXsA-z_n4LGmWrwC088bygcGJtAditnWQe2nH-ZE HWTL92OL-Tup0-8ex8A9jnG3OaJzTxlF4OwiiDsX fmode
qshell qupload2 --src-dir=$CPATH/../dist/nova-repos/ --bucket=nova-repos --overwrite --rescan-local
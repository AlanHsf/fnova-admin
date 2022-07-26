
PROJECT_NAME=$1
VERSION_TIME=`date "+%Y%m%d%H%M%S"`

echo "正在打包可执行文件：${PROJECT_NAME}"

# sudo cnpm i -g yarn 
# sudo cnpm i -g electron
mkdir -p ./dist/dist
rm -rf ./dist/dist/*

# 复制项目配置文件（名称、版本、ICON相关）
cp package.json ./dist/
if [ -e ./apps/$PROJECT_NAME/package.json ]
then
echo "copy apps package.json"
cp -rf ./apps/$PROJECT_NAME/package.json ./dist/package.json
fi

cd ./dist
cnpm i

cp -rf ../plugins ./
mkdir -p ./node_modules/@paulcbetts/vueify/node_modules/yallist/
npx electron-builder install-app-deps
npx electron-builder -l -w

# 复制Window可执行文件及安装脚本
mkdir -p ../../release/$PROJECT_NAME/win/
cp -rf ./dist/NovaAdmin*.exe ../../release/$PROJECT_NAME/win/${PROJECT_NAME}-${VERSION_TIME}.exe
# cp -f ./dist/NovaAdmin.exe ../../release/$PROJECT_NAME/win/NovaAdmin_32.exe
if [ -d ../apps/$PROJECT_NAME/target/win ]
then
cp -rf ../apps/$PROJECT_NAME/target/win/* ../../release/$PROJECT_NAME/win/
fi

# 复制Linux可执行文件及安装脚本
mkdir -p ../../release/$PROJECT_NAME/linux/
cp -f ./dist/NovaAdmin*.AppImage ../../release/$PROJECT_NAME/linux/${PROJECT_NAME}-${VERSION_TIME}.AppImage
# cp -f ./dist/NovaAdmin-0.7.0-x86_64.AppImage ../../release/$PROJECT_NAME/linux/NovaAdmin_32.AppImage

if [ -d ../apps/$PROJECT_NAME/target/linux ]
then
cp -rf ../apps/$PROJECT_NAME/target/linux/* ../../release/$PROJECT_NAME/linux/
fi

# mkdir -p dist/linux-unpacked/resources/node_modules
# mkdir -p dist/win-unpacked/resources/node_modules
# cp -rf ../plugins/nova-serve node_modules/
# cp -rf ../plugins/nova-serve dist/linux-unpacked/resources/
# cp -rf ../plugins/nova-serve dist/win-unpacked/resources/
# cp -rf ../plugins dist/linux-unpacked/resources/
# cp -rf ../plugins dist/win-unpacked/resources/

################ builder
# cnpm i -S tslib
# cnpm i -S path
# cnpm i -S fs

# cnpm i -D electron-builder@22.10.5
# cnpm i -D electron
# cnpm i -D electron-webpack
# cnpm i -D webpack
# npm i -D @paulcbetts/vuerify


## FAQ: not found all node_modules depands
# add this line to package.json:
# "postinstall": "electron-builder install-app-deps",

################ forge
# cnpm install --save-dev @electron-forge/cli
# cnpm install --save-dev @electron-forge/maker-zip
# cnpm i -S electron-squirrel-startup
# cnpm i -S electron-compile
# cnpm i -D debug
# cnpm i -D fs-extra
# cnpm i -D @electron-forge/cli
# cnpm i -D @electron-forge/maker-zip
# cnpm i -D electron-prebuilt-compile
# npx electron-forge import

################ packager
# cnpm install --save-dev electron-packager
# npx electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]
# npx electron-packager ./ engexam-jxlg --platform=win32 --arch=ia32,x64






## 打包工具选型对比，推荐：electron-builder https://github.com/electron-userland/electron-builder

# Electron-forge only packages for your current platform, so it doesn't really work for packaging cross platform apps unless you own each of the platforms and don't mind packaging on each of them separately.

# Electron-packager does package for each platform, but it only produces unpackaged applications. This means you'll need to provide your users with all the files in each package directory in order for the executables to work.

# Electron-builder is my recommendation as it packages for each platform and produces packaged applications. It also can produce unpackaged applications so there's no need to use electron-packager.
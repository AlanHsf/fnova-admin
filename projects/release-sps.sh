#!/bin/sh
cd ../
ng build --prod --project="metapunk-sps-bot"
scp -r dist/metapunk-sps-bot/* fmode@nova0.fmode.cn:/home/fmode/workspace/nova/nova-admin/dist/metapunk-sps-bot/
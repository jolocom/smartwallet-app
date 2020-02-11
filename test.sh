#!/bin/bash

cp ~/1.6/1.6.empty.sqlite3 ./db.sqlite3;
yarn typeorm:repl;
rm ./db.sqlite3

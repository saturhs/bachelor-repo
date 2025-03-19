# bachelor-repo
 bachelor repo

npm run dev - in my-dairy-darm folder to run the main server

# in C:/program files/mongodb/server/7.0/bin
mongod --dbpath /c:/Users/saturhs/Desktop/GitHub/bachelor-repo/database/data - in mongodb bin folder to run the database

# in C:/program files/mongodb/tools/100/bin
mongodump --db my-dairy-farm --out "C:\Users\saturhs\Desktop\GitHub\bachelor-repo\database\backups" - backup of database

mongorestore --db my-dairy-farm "C:\Users\saturhs\Desktop\GitHub\bachelor-repo\database\backups\my-dairy-farm" - restores backup of database

npx directory-tree-ascii . --ignore node_modules,dist

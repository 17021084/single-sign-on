# SSO-Demo


```bash
git pull mysql:5.6

docker run  -it \
--name=sql-server \
--env="MYSQL_ROOT_PASSWORD=123456" \
--publish 6603:3306 \
mysql
```
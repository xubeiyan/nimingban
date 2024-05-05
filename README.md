# nimingban

## 简介

准备使用`SvelteKit`搭建一个类似于A岛（已停止运营）或者2chan，4chan的匿名版论坛

后端数据库使用`PostgresSQL`

## 资源设计

| 功能  | 路径（和请求方法）        | 携带参数 |
| ----  | ---------------         | ------- |
| 主页  | GET /                    |         |
| 某个版 | GET /board/{board_name} |         | 
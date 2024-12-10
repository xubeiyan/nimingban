# nimingban

## 简介

#### 一个类似于A岛（已停止运营）或者2chan，4chan的匿名版论坛

- 使用 `SvelteKit` 元框架，搭配 `Svelte v4`
- 样式库使用 `TailwindCSS v3`
- 数据库使用 `PostgresSQL`

## 支持功能

### 普通用户

- [x] 明亮/黑暗模式
- [x] 注册用户
- [x] 登录用户
- [x] 申请饼干（匿名版常用需要饼干才能发帖）
- [x] 多饼干切换
- [x] 密码修改
- [x] 两层版块（第一层称作分区，第二层称作版块）
- [x] 发串支持 `Markdown` 语法，有预览功能，具体参考[这里](#markdown-编辑器支持语法)
- [x] 回复也支持 `Markdown` 语法（笑看某V2EX

### 管理者

- [x] 串管理（编辑、修改可见性、删除）
- [x] 版块管理（新建，删除，修改，列表）
- [x] 版块简介支持 `Markdown` 语法
- [x] 用户和饼干管理（查询，修改可用性）

## 路由设计

| 功能                       | 路径（和请求方法）                      | 携带参数 |
| -------------------------- | --------------------------------------- | -------- |
| 主页                       | GET /                                   |          |
| 某个版                     | GET /board/{board_url}                  |          |
| （管理）编辑某串或评论     | POST /board/editPostOrComment/{post_id} |          |
| 获取某个版的串             | GET /board/getPosts/{board_url}         |          |
| 发送串                     | POST /board/sendPost/{board_url}        |          |
| 发送回复串                 | POST /board/sendComment/{post_id}       |          |
| 获取某串回复               | GET /comment/{post_id}                  |          |
| 获取某串最新回复           | GET /comment/latest/{post_id}           |          |
| 获取单独某条回复           | GET /comment/single/{comment_id}        |          |
| 查看某串                   | GET /post/{post_id}                     |          |
| 登录                       | POST /login                             |          |
| （管理）添加版块           | POST /manage/addBoard                   |          |
| （管理）添加分区           | POST /manage/addSection                 |          |
| （管理）编辑串状态         | POST /manage/editPostStatus/{id}        |          |
| （管理）获取版块列表       | GET /manage/getBoardList/{id}           |          |
| （管理）获取分区列表       | GET /manage/getSectionList              |          |
| （管理）删除版块           | GET /manage/removeBoard/{id}            |          |
| （管理）删除评论           | GET /manage/removeComment/{id}          |          |
| （管理）删除串             | GET /manage/removePost/{id}             |          |
| （管理）删除分区           | GET /manage/removeSection/{id}          |          |
| （管理）搜索用户或饼干     | POST /manage/seachCookies               |          |
| （管理）切换用户或饼干状态 | POST /manage/toggleUserStatus           |          |
| （管理）更新版块           | POST /manage/updateBoard                |          |
| （管理）更新分区           | POST /manage/updateSection              |          |
| 注册                       | POST /register                          |          |
| 获取饼干                   | GET /user/getNewCookies                 |          |
| 刷新JWT                    | POST /user/refreshJWT                   |          |
| 修改密码                   | POST /user/updatePassword               |          |

## 参数设置

- JWTSECRET JSON Web Token 的密钥值
- COOKIES_LIMIT 每个用户最大可申请饼干数

## 表设计

### section

<details>
<summary>点击展开 区域名 表设计</summary>

| 列名         | 数据类型   | 备注 |
| ------------ | ---------- | ---- |
| id           | uuid       |      |
| section_name | vchar(256) |      |
| order        | integer    |      |

</details>

### board

<details>
<summary>点击展开 版块 表设计</summary>

| 列名               | 数据类型   | 备注                              |
| ------------------ | ---------- | --------------------------------- |
| id                 | uuid       |                                   |
| parent_section_id  | uuid       |                                   |
| min_post_second    | integer    | default 10                        |
| min_post_timestamp | timestamp  |                                   |
| access_type        | vchar(16)  | 可选值 `all` `view_only` `hidden` |
| name               | vchar(256) |                                   |
| url_name           | vchar(256) |                                   |
| intro              | text       |                                   |
| order              | integer    |                                   |

</details>

### post

<details>
<summary>点击展开 串 表设计</summary>

| 列名              | 数据类型   | 备注                                   |
| ----------------- | ---------- | -------------------------------------- |
| id                | uuid       |                                        |
| status            | vchar(16)  | 可选值 `repliable` `readonly` `hidden` |
| belong_board_id   | uuid       |                                        |
| poster_name       | vchar(256) |                                        |
| poster_email      | vchar(256) |                                        |
| title             | vchar(256) |                                        |
| content           | text       |                                        |
| poster_cookies_id | uuid       |                                        |
| post_timestamp    | timestamp  |                                        |
| edit_timestamp    | timestamp  |                                        |

</details>

### post_comment_image

<details>
<summary>点击展开 串内图像 表设计</summary>

| 列名       | 数据类型  | 备注                                   |
| ---------- | --------- | -------------------------------------- |
| id         | uuid      |                                        |
| image_type | vchar(16) | 可用值 `png` `jpg` `gif` `webp` `avif` |
| exist_type | vchar(16) | 可用值 `exist` `hidden` `remove`       |
| post_id    | uuid      |                                        |

</details>

### comment

<details>
<summary>点击展开 评论 表设计</summary>

| 列名           | 数据类型   | 备注 |
| -------------- | ---------- | ---- |
| id             | uuid       |      |
| belong_post_id | uuid       |      |
| poster_name    | vchar(256) |      |
| poster_email   | vchar(256) |      |
| title          | vchar(256) |      |
| content        | text       |      |
| post_timestamp | timestamp  |      |
| edit_timestamp | timestamp  |      |

</details>

### user

<details>
<summary>点击展开 用户 表设计</summary>

| 列名             | 数据类型   | 备注                       |
| ---------------- | ---------- | -------------------------- |
| id               | uuid       |                            |
| status           | vchar(16)  | 可用值 `enable` `disabled` |
| username         | vchar(256) |                            |
| password_hash    | vchar(64)  |                            |
| password_salt    | vchar(64)  |                            |
| type             | vchar(16)  | 可用值 `admin` `user`      |
| create_timestamp | timestamp  |                            |

</details>

### cookies

<details>
<summary>点击展开 用户饼干 表设计</summary>

| 列名             | 数据类型  | 备注                      |
| ---------------- | --------- | ------------------------- |
| id               | uuid      |                           |
| belong_user_id   | uuid      |                           |
| create_timestamp | timestamp |                           |
| expire_timestamp | timestamp |                           |
| content          | vchar(32) |                           |
| status           | vchar(16) | 可用值 `enable` `disable` |

</details>

### site_settings

<details>
<summary>点击展开 网站设定 表设计</summary>

| 列名        | 数据类型   | 备注 |
| ----------- | ---------- | ---- |
| name        | vchar(64)  |      |
| data_type   | vchar(64)  |      |
| value       | vchar(128) |      |
| description | vchar(256) |      |

| 支持的值     | 说明                | 数据类型 | 默认值              |
| ------------ | ------------------- | -------- | ------------------- |
| site_name    | 站点名称            | "string" | "匿名版"            |
| cookie_limit | 饼干限制            | "number" | "5"                 |
| jwt_secret   | JSON Web Token 密钥 | "string" | "nimingban20241011" |

</details>

## Markdown 编辑器支持语法

- [x] `heading` h1~h4
- [x] `text`
- [x] `paragraph`
- [x] `emphasis`
- [x] `strong`
- [x] `inlineCode`
- [x] `code`
- [x] `delete`
- [x] `hr`
- [x] `blockquote`
- [x] `link`
- [x] `image`
- [x] `list`
- [x] `table`
- [x] `spoiler` 参考reddit `>! hidden text !<`

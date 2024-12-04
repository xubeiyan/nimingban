# nimingban

## 简介

#### 一个类似于A岛（已停止运营）或者2chan，4chan的匿名版论坛

- 使用 `SvelteKit` 元框架
- 样式库使用 `TailwindCSS`
- 数据库使用`PostgresSQL`

## 路由设计

| 功能             | 路径（和请求方法）                | 携带参数 |
| ---------------- | --------------------------------- | -------- |
| 主页             | GET /                             |          |
| 某个版           | GET /board/{board_url}            |          |
| 获取某个版的串   | GET /board/getPosts/{board_url}   |          |
| 发送串           | POST /board/sendPost/{board_url}  |          |
| 发送回复串       | POST /board/sendComment/{post_id} |          |
| 获取某串回复     | POST /comment/{post_id}           |          |
| 获取某串最新回复 | POST /comment/latest/{post_id}    |          |
| 查看某串         | GET /post/{post_id}               |          |
| 登录             | POST /login                       |          |
| 注册             | POST /register                    |          |
| 获取饼干         | GET /user/getNewCookies           |          |
| 修改密码         | POST /user/updatePassword         |          |

## 参数设置

- JWTSECRET Json Web Token 的密钥值
- COOKIES_LIMIT

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

| 列名             | 数据类型   | 备注                                   |
| ---------------- | ---------- | -------------------------------------- |
| id               | uuid       |                                        |
| status           | vchar(16)  | 可用值 `enable` `disabled` `forbidden` |
| username         | vchar(256) |                                        |
| password_hash    | vchar(64)  |                                        |
| password_salt    | vchar(64)  |                                        |
| type             | vchar(16)  | 可用值 `admin` `user`                  |
| create_timestamp | timestamp  |                                        |

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

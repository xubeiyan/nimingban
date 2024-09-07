# nimingban

## 简介

准备使用`SvelteKit`搭建一个类似于A岛（已停止运营）或者2chan，4chan的匿名版论坛

后端数据库使用`PostgresSQL`

## 资源设计

| 功能  | 路径（和请求方法）        | 携带参数 |
| ----  | ---------------         | ------- |
| 主页  | GET /                    |         |
| 某个版 | GET /board/{board_name} |         | 

## 参数设置

### 版面参数

* 版规
* 是否允许发帖
* 允许组/禁止组
* 发帖间隔
* 串最大长度
* 串附件图片最大数
* 串图片大小限制

### 用户参数

* 分组 
    * ADMIN 管理员
    * USER 普通用户
    * GUEST 分配账户的普通用户
    * NOLOGIN 被禁止登录的用户

## 表设计

### section 

区域名，用于版块的上级
    * id uuid
    * section_name vchar(256)
    * order integer

### board

版块，可以允许发串的地方
    * id uuid
    * parent_section_id uuid 
    * min_post_second integer default 30
    * min_post_timestamp timestamp
    * access_type char(16) 'all' 'view_only' 'hidden'
    * name vchar(256)
    * url_name vchar(256)
    * intro text
    * order integer

### post

发送的串

    * id uuid
    * belong_board_id uuid
    * poster_name vchar(256)
    * poster_email vchar(256)
    * title vchar(256)
    * content text
    * poster_cookies_id uuid
    * post_timestamp timestamp
    * edit_timestamp timestamp

### post_comment_image

串和评论的图

    * id uuid
    * image_type char(16) 'png' 'jpg' 'gif' 'webp' 'avif'
    * exist_type char(16) 'exist' 'hidden' 'remove'
    * post_id uuid

### comment

评论

    * id uuid
    * belong_post_id uuid
    * belong_comment uuid
    * poster_name vchar(256)
    * poster_email vchar(256)
    * title vchar(256)
    * content text
    * poster_cookies_id uuid
    * post_timestamp timestamp
    * edit_timestamp timestamp

### user

用户

    * id uuid
    * status char(16) 'enable' 'disabled' 'forbidden'
    * username vchar(256)
    * password_hash vchar(64)
    * password_salt vchar(64)
    * type char(16) 'admin' 'user' 'guest'

### cookies

用户饼干

    * id uuid
    * belong_user_id uuid
    * create_timestamp timestamp
    * expire_timestamp timestamp
    * content char(16)
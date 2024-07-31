<p>
<strong><h2>無名の主页 - 优化版</h2></strong>
</p>

![無名の主页](https://s2.loli.net/2022/07/14/K5JigfvDoNewtuS.webp)

>本存库的 Logo 字体使用完整字体

### 优化内容
本存库对配置文件进行了小幅度更改，增加了**萌备**选项

> 由于技术力不够，目前只能填入数字部分，但**其他文字**会自动新增<br />
> 同时与正常的备案显示规则一致（无内容时不显示）

``` properties
# 萌 ICP 备案号
## 若不需要，请设为空即可
VITE_SITE_ICPMOE = "00000000"
```

同时，我们也对配置文件中的`VITE_WEATHER_KEY`进行了IP白名单调整，所以您需要手动跳转至[高德开放平台控制台](https://console.amap.com/dev/index)申请网页端KEY

env文件中配置的`VITE_SONG_API`各位随时可以使用，如果域名已到期请尝试自己配置或转回`https://api-meting.imsyy.top/api`

> 以下是上游项目的配置内容
### 部署

* **安装** [node.js](https://nodejs.org/zh-cn/) **环境**

  > node > 16.16.0  
  > npm > 8.15.0
  
* 然后以 **管理员权限** 运行 `cmd` 终端，并 `cd` 到 项目根目录
* 在 `终端` 中输入：

```bash
# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install

# 预览
pnpm dev

# 构建
pnpm build
```
> 构建完成后，静态资源会在 **`dist` 目录** 中生成，可将 **`dist` 文件夹下的文件**上传至服务器，也可使用 `Vercel` 等托管平台一键导入并自动部署

### 网站链接

在 `src/assets/siteLinks.json` 中可以自定义网站链接（以指向自己的网站）:

```json
{
  "icon": "Blog",						
  "name": "博客",						
  "link": "https://blog.imsyy.top/"	
},
```

其中 `icon` 网站链接的图标可以在 `src/components/Links/index.vue` 中添加:

```js
// 可前往 https://xicons.org 自行挑选并在此处引入
// 此处源存库用的是www域名（www.xicons.org），我tm愣是访问不上
// 此处引入的是 fa 类型
import {
  Link,
  Blog,
  CompactDisc,
  Cloud,
  Compass,
  Book,
  Fire,
  LaptopCode,
} from "@vicons/fa";

...

// 网站链接图标
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
};
```

### 社交链接

在 `src/assets/socialLinks.json` 中可以自定义社交链接。

### 天气

天气及地区获取需要 `高德开放平台` 相关 API

- 前往 [高德开放平台控制台](https://console.amap.com/dev/index) 创建一个 `Web 服务` 类型的 `Key`，并将 `Key` 填入 `.env` 中的 `VITE_WEATHER_KEY` 中

也可自行更换其他方式


### 音乐

>本项目采用了基于 `MetingJS` 的 `Aplayer` 音乐播放器，可实现快速自定义歌单  
>*仅支持 **中国大陆地区**

请在 `.env` 文件中更改歌曲相关参数即可实现自定义歌单列表

```bash
# 歌曲 API 地址（本处我们使用了自主构建的 MetingJS 音乐 API）
# VITE_SONG_API = "https://api-meting.imsyy.top/api"（备用）
VITE_SONG_API = "https://meting.spr.us.kg/api"
# 歌曲服务器 ( netease-网易云, tencent-qq音乐 )
VITE_SONG_SERVER = "netease"
# 播放类型 ( song-歌曲, playlist-播放列表, album-专辑, search-搜索, artist-艺术家 )
VITE_SONG_TYPE = "playlist"
# 播放 ID
VITE_SONG_ID = "7452421335"
```

### 字体

采用 `HarmonyOS Sans` 开源字体，采用字体拆分，提升加载速度

由于源站 `CDN` 已开启防盗链，**非源站域名不可访问**，请将字体引入链接更改为下方内容，否则 **自定义字体将失效**

>`https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css`


### 网站图标及网站背景

#### 网站背景

可以在 `public/images` 中修改网站背景

如果想要添加更多的本地图片作为网站背景，可以将图片重命名 `background+数字` 的形式，并在 `src/components/Background/index.vue` 中进行修改：

```js

if (type == 0) {
  // 修改此处 Math.random() 后面的第一个数字为图片的数量
  bgUrl.value = `/images/background${Math.floor(
    Math.random() * 10 + 1
  )}.webp`;
}
```

#### 网站图标

可以在 `public/images/icon` 中修改网站图标。

### 技术栈

* [Vue](https://cn.vuejs.org/)
* [Vite](https://vitejs.cn/vite3-cn/)
* [Pinia](https://pinia.vuejs.org/zh/)
* [IconPark](https://iconpark.oceanengine.com/official)
* [xicons](https://xicons.org/)
* [Aplayer](https://aplayer.js.org/)

### API

* [MetingAPI By SPR-Community](https://meting.spr.us.kg/api)
* [搏天 API](https://api.btstu.cn/doc/sjbz.php)
* [高德开放平台](https://lbs.amap.com/)
* [Hitokoto 一言](https://hitokoto.cn/)
* 

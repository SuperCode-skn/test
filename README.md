# AI 聊天机器人 (DeepSeek API)

这是一个简单的前后端分离的 AI 聊天机器人项目。

- **后端**: Node.js + Express
- **前端**: 原生 HTML, CSS, JS
- **AI 服务**: DeepSeek API (流式响应)

## 1. 先决条件

在开始之前，请确保您已安装 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)。安装 Node.js 的同时会自动安装 `npm`。

## 2. 安装

克隆或下载此项目后，在项目根目录下打开终端，然后运行以下命令来安装所需的依赖项：

```bash
npm install
```

## 3. 配置 API 密钥

这是最重要的一步。您需要将您的 DeepSeek API 密钥配置到后端服务器中。

1.  打开 `server.js` 文件。
2.  找到以下这行代码：

    ```javascript
    'Authorization': `Bearer YOUR_DEEPSEEK_API_KEY`
    ```

3.  将 `YOUR_DEEPSEEK_API_KEY` 替换为您自己的真实 DeepSeek API 密钥。**请务必保留 `Bearer ` 前缀和空格**。

    例如，如果您的密钥是 `sk-12345...`，那么修改后应如下所示：

    ```javascript
    'Authorization': `Bearer sk-12345...`
    ```

## 4. 运行应用

配置完成后，在项目根目录下运行以下命令来启动服务器：

```bash
npm start
```

您应该会在终端看到以下输出：

```
Server is running at http://localhost:3000
```

## 5. 访问应用

打开您的浏览器，访问以下地址即可开始聊天：

[http://localhost:3000](http://localhost:3000)

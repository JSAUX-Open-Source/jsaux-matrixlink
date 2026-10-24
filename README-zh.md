# JSAUX PIXEL / MatrixLink（开源）

本仓库包含 JSAUX PIXEL 软件面向 **Steam Machine 点阵屏面板（Pixel Matrix Faceplate）**
的开源部分：USB 连接协议文档、参考编解码、LED 矩阵 API，以及 Decky 插件源码。

日常使用请安装官方 JSAUX PIXEL 发行版：
[Steam Machine 面板 App 安装指南](https://jsaux.com/pages/steam-machine-faceplate-app-installation-guide)。

[English](./README.md)

## 基本信息

| | |
|--|--|
| **适用产品** | Pixel Matrix Faceplate for Steam Machine |
| **对应官方软件线** | JSAUX PIXEL **V1.2** |
| **官方下载 / 安装** | [jsaux.com 安装指南](https://jsaux.com/pages/steam-machine-faceplate-app-installation-guide) |
| **变更记录** | [`CHANGELOG.md`](./CHANGELOG.md) |
| **问题反馈** | [GitHub Issues](https://github.com/JSAUX-Open-Source/jsaux-matrixlink/issues) |
| **安全问题** | [`SECURITY.md`](./SECURITY.md)（`security@jsaux.com`） |
| **贡献指南** | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |

## 本仓库开了什么

本 tip **开源的是主机侧连接协议与插件源码**。官方伴生应用（`jsaux-matrix-daemon`、
Studio）仍为闭源，仅随官方 JSAUX PIXEL 发行包提供。

| 本仓库开源 | 不属于本发行 |
|------------|--------------|
| [USB 主机↔设备连接协议](docs/protocols/usb-serial-connection.zh.md) | 固件、制造工具与官方伴生应用 |
| 参考编解码 [`protocols/usb/`](protocols/usb/) | 芯片 / PCBA / 灯板驱动硅细节 |
| [LED 矩阵主机 API](docs/protocols/matrix-led-api.md) | 闭源安装包所用的 Qt 运行库再分发 |
| Decky 插件编排 + 入库 UI 产物 | 捆绑的 Codex CLI / 登录界面 |

没有官方伴生时，大部分 Decky 产品能力（设备状态、显示模式、自定义素材、计时、上屏同步）
无法驱动硬件。本 tip 仍可用于阅读协议文档、跑 LED API / 编解码单测，以及查看插件源码。

## 写入存储

**2026 年 11 月前出厂的面板**：每次上传的画面都会写入面板存储。显示已上传的图片 / GIF
本身不会磨损存储，但反复上传新帧会。若基于 LED API 或帧导出做二次开发，请仅在内容变化时上传，
避免每秒重绘上传。

## AI Agent（可选）

仅用本机 `~/.codex/` 会话文件显示 **会话名**与是否 **运行中**（不联网、无 OAuth、无额度接口）。
本 tip 不捆绑 Codex，也不提供登录 UI。

## 用开源 tip 覆盖官方 Decky 插件

若已安装官方闭源伴生，可用本 tip 的插件源码覆盖官方插件目录。
见 [`docs/replace-official-plugin.md`](docs/replace-official-plugin.md)。

## 前端说明

`decky-plugin/dist/index.js` 为入库的 Decky UI 产物；对应 TSX 源码不在本 tip，
无法仅凭本仓库完整重建界面。bundle 内组帧辅助与 `protocols/usb`（CRC-16/KERMIT）一致。

## 许可证

见根目录 [`LICENSE`](./LICENSE)（MIT）。第三方见 [`NOTICE`](./NOTICE)。
另行获取的闭源伴生二进制不因本 tip 而变为 MIT。

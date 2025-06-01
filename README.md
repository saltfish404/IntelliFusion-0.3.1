# IntelliFusion

![IntelliFusionicon](res/IntelliFusion_icon_Sketch_20230923f_small.png)

[![Fork me on Gitee](https://gitee.com/argonserver/IntelliFusion/widgets/widget_6.svg?color=00d4d4)](https://gitee.com/argonserver/IntelliFusion)
[![star](https://gitee.com/argonserver/IntelliFusion/badge/star.svg?theme=gray)](https://gitee.com/argonserver/IntelliFusion/stargazers)

## 介绍
intelliFusion是一个开源的、高自由度、支持多种模型库的AI模型库的使用平台。为方便不同库的使用，我们支持用户自行导入不同的模型库。

intelliFusion 采用以下技术栈构建：
- 后端使用Flask框架提供Web服务
- 使用FlaskWebGUI实现桌面应用封装
- 使用Ajax实现异步数据获取
- 集成系统监控功能：
  - CPU使用率监控
  - GPU使用率监控（通过pynvml）
  - 内存使用监控（通过psutil）
- 支持多种AI模型：
  - OpenAI API（支持GPT系列模型）
  - ChatGLM系列模型
  - 其他支持JSON,OpenAI,WebUI,API调用的语言模型
- 提供基础的系统资源监控功能
- 支持多语言提示词配置



## 支持模型

**通过webui调用的所有模型**
- 支持所有带有原生界面的模型

**通过api调用的语言模型**
- [ChatGPT](https://chat.openai.com) ([GPT-4](https://openai.com/product/gpt-4))

**通过OpenAI插件调用的语言模型**
- [ChatGPT](https://chat.openai.com) ([GPT-4](https://openai.com/product/gpt-4))
- [ChatGLM](https://github.com/THUDM/ChatGLM-6B) ([ChatGLM2](https://github.com/THUDM/ChatGLM2-6B))

**通过JSON插件调用的语言模型**
- [Ollama]

## 更新信息

**[2023/06/23]** 发布[intelliFusion](https://github.com/hcl595/IntelliFusion)

----
**[2023/07/29]** 发布[intelliFusion](https://github.com/hcl595/IntelliFusion),intelliFusion 的升级版本，在保留了之前带有的功能的基础之上，intelliFusion 引入了如下新特性：

1. **更方便的使用**：基于上一个版本的内测反应情况，我们全面升级了 intelliFusion 的基础功能。使用户可以在账户界面控制模型的开启与关闭
2. **更流畅的沟通**：我们改善了用户与ai交流之间的延迟

----
**[2023/08/05]** 发布[intelliFusion](https://github.com/hcl595/IntelliFusion),intelliFusion 的升级版本，在保留了之前带有的功能的基础之上，intelliFusion 引入了如下新特性：

1. **更好的体验**：修复了已知的bug
2. **优化小组件**：新增内置GPU占用监测
3. **更好的背景**：添加了深浅模式切换按钮，可以按照用户需求切换背景色
4. **更好的对胡**：提示词可更换语言（目前仅支持日语和中文）
5. **优化底层代码**：使用ajax，代替jinjia2和form表单

----
**[2025/05/31]** 发布[intelliFusion](https://github.com/saltfish404/IntelliFusion-0.3.1),intelliFusion 的升级版本，在保留了之前带有的功能的基础之上，intelliFusion 引入了如下新特性：

1. **优化小组件**：我们优化了小插件的显示，更新了一部分的内容.
2. **更好的优化**：修复了bug.
3. **更好的调用**：添加了活跃检测，实时监测您所启用的模型，可以只调用在线模型.
4. **更好的沟通**：内置多语言提示词库，拥有提示词框，可以辅助您更方便的调用模型.

----
**[2025/06/01]** 发布[intelliFusion](https://github.com/saltfish404/IntelliFusion-0.3.1),intelliFusion 的升级版本，在保留了之前带有的功能的基础之上，intelliFusion 引入了如下新特性：

1. **天气组件升级**：
   - 新增基于IP自动定位城市功能
   - 增加VPN/代理检测，提升定位准确性
   - 支持手动城市搜索，集成和风天气城市数据库
   - 修复风向箭头指向，符合气象标准
   - 优化错误处理与兜底机制，提升健壮性
   - UI视觉增强：
     - 能见度阶梯图（右对齐，宽度80px）
     - 气压半环仪表盘
     - 空气质量指示器
     - 紫外线指数分级着色
     - 风向罗盘
     - 湿度柱状图

----
**[2025/06/01]** 天气组件和系统监控全面升级：

1. **全自适应填充**：天气组件、CPU、GPU、RAM、WiFi流量等所有小组件均支持自适应填充父容器，自动缩放，UI风格统一。
2. **天气卡片智能缩放**：天气卡片支持实时检测父容器长宽高，自动缩放字体和行距，保证全屏/嵌入/拉伸下都能美观填充。
3. **WiFi仪表盘灵敏指针**：WiFi仪表盘指针动态缩放，低速也能灵敏显示。
4. **系统资源监控更健壮**：后端接口健壮，支持实时系统资源监控。
5. **依赖与文档完善**：requirements.txt和README.md同步更新，支持一键部署。

## 了解更多

- [想反馈问题？]修改者邮箱：2102395859@qq.com


向开发者喝杯冰红茶

# IntelliFusion Dashboard

## 快速启动
1. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

2. 配置API密钥：
   在项目根目录创建 `.env` 文件，添加以下内容：
   ```
   # 和风天气API密钥
   QWEATHER_API_KEY=your_qweather_api_key_here

   # 聚合数据API密钥
   JUHE_CALENDAR_KEY=your_juhe_calendar_key_here
   JUHE_STAR_KEY=your_juhe_star_key_here
   JUHE_LAOHUANG_LI_KEY=your_juhe_laohuang_li_key_here
   ```
   
   获取API密钥：
   - 和风天气API：访问 [和风天气开发平台](https://dev.qweather.com/) 注册并创建应用
   - 聚合数据API：访问 [聚合数据开放平台](https://www.juhe.cn/) 注册并创建应用

3. 启动服务：
   ```bash
   python src/client.py
   ```


## 依赖
详见 requirements.txt

## 其它
如需自定义UI/功能，详见源码注释。





## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- QWeather API for weather data
- ip-api.com for IP geolocation
- All other open source libraries and tools used in this project

# ⚠️ 二次开发说明

本项目基于 [hcl595/IntelliFusion](https://github.com/hcl595/IntelliFusion) 按照 Apache 2.0 协议进行修改和扩展。
原作者：hcl595
当前仓库仅为 @saltfish404 的个人二次开发/学习用途。


## 致谢
- 原项目：[hcl595/IntelliFusion](https://github.com/hcl595/IntelliFusion)
- QWeather API、ip-api.com 等所有开源项目和数据服务



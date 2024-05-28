// ==UserScript==
// @name        SPXXKLP
// @description Minecraft.net & X.com blog article to BBCode converter, adapted to KLPBBS
// @namespace   npmjs.com/package/@spxxklp/userscript
// @author      Cinder & SPGoding & SPX Fellow
// @connect     feedback.minecraft.com
// @connect     help.minecraft.net
// @connect     raw.githubusercontent.com
// @connect     *
// @homepage    https://github.com/cinder0601/SPXXKLP
// @match       https://www.minecraft.net/en-us/article/*
// @match       https://www.minecraft.net/zh-hans/article/*
// @match       https://x.com/*/status/*
// @match       https://feedback.minecraft.net/hc/en-us/articles/*
// @match       https://help.minecraft.net/hc/en-us/articles/*
// @require     https://fastly.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js
// @version     3.1.2
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491477/SPXXKLP.user.js
// @updateURL   https://update.greasyfork.org/scripts/491477/SPXXKLP.meta.js
// ==/UserScript==
(function () {
  'use strict';

  GM_config.init({
    id: 'spxxklp',
    title: 'SPXXKLP Userscript',
    fields: {
      translator: {
        label: '译者名',
        type: 'text',
        default: '<默认译者>'
      },
      bugSource: {
        label: '选择翻译源',
        type: 'select',
        options: ['Github', 'Custom'],
        default: 'Github'
      },
      bugCenterTranslation: {
        label: '漏洞翻译源',
        type: 'text',
        default: 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/crowdin/zh-CN/zh_CN.json'
      },
      bugCenterTranslator: {
        label: '漏洞译者源',
        type: 'text',
        default: 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/translator.json'
      },
      bugCenterColor: {
        label: '漏洞颜色源',
        type: 'text',
        default: 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/color.json'
      }
    }
  });
  GM_registerMenuCommand('Edit Configuration', () => GM_config.open());
  const src = GM_config.get('bugSource');
  let tr = "";
  let tor = "";
  let c = "";

  if (src == "Github") {
    console.log("[SPXXKLP] Using Github bug center");
    tr = 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/crowdin/zh-CN/zh_CN.json';
    tor = 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/translator.json';
    c = 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/color.json';
  }else if (src == "Custom") {
    console.log("[SPXXKLP] Using custom bug center");
    tr = GM_config.get('bugCenterTranslation');
    tor = GM_config.get('bugCenterTranslator');
    c = GM_config.get('bugCenterColor');
  }

  const config = {
    translator: GM_config.get('translator'),
    bugCenter: {
      translation: tr,
      translator: tor,
      color: c
    }
  };

  var version = "3.1.2";

  const bugsCenter = config.bugCenter.translation;
  const bugsTranslatorsTable = config.bugCenter.translator;
  const translatorColorTable = config.bugCenter.color;
  const spxxklpVersion = version;

  function getHeader(articleType, type) {
    if (articleType.toLowerCase() !== 'news') {
      return `[align=left][color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][/font][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/font][/size][/align][/align][/align][/align][hr]\n`;
    }

    switch (type) {
      case VersionType.Snapshot:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft Java 版[/b]是指 Windows、Mac OS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4][b]每周快照[/b]是 Minecraft Java 版的测试机制，主要用于下一个正式版的特性预览。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]然而，[b]每周快照[/b]主要用于新特性展示，通常存在大量漏洞。因此对于普通玩家建议仅做[color=Red][b]测试尝鲜[/b][/color]用。在快照中打开存档前请务必[color=Red][b]进行备份[/b][/color]。[b]适用于正式版的 Mod 不兼容快照，且大多数 Mod 都不对每周快照提供支持[/b]。 [/size]
[color=#f44336][size=5]|[/size][/color][size=4]Minecraft Java 版 <正式版版本号> 仍未发布，<当前版本号> 为其第 <计数> 个预览版。[/size]
[color=#388e3c][size=5]|[/size][/font][/color][size=4]本文内容按照 [/font][/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][/font][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/font][/size][hr]\n`;

      case VersionType.PreRelease:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft Java 版[/b]是指 Windows、Mac OS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4][b]预发布版[/b]是 Minecraft Java 版的测试机制，如果该版本作为正式版发布，那么预发布版的游戏文件将与启动器推送的正式版完全相同。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]然而，预发布版主要用于服主和 Mod 制作者的预先体验，如果发现重大漏洞，该预发布版会被新的预发布版代替。因此建议普通玩家[color=Red]持观望态度[/color]。 [/size]
[color=#f44336][size=5]|[/size][/color][size=4]Minecraft Java 版 <正式版版本号> 仍未发布，<当前版本号> 为其第 <计数> 个预览版。[/size]
[color=#388e3c][size=5]|[/size][/font][/color][size=4]本文内容按照 [/font][/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][/font][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/font][/size][hr]\n`;

      case VersionType.ReleaseCandidate:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft Java 版[/b]是指 Windows、Mac OS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4][b]候选版[/b]是Minecraft Java版正式版的候选版本，如果发现重大漏洞，该候选版会被新的候选版代替。如果一切正常，该版本将会作为正式版发布。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]候选版已可供普通玩家进行抢鲜体验，但仍需当心可能存在的漏洞。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]<正式版版本号> 仍未发布，<当前版本号> 为其第 <计数> 个预览版。[/size]
[color=#388e3c][size=5]|[/size][/font][/color][size=4]本文内容按照 [/font][/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][/font][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/font][/size][hr]\n`;

      case VersionType.Release:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft Java 版[/b]是指 Windows、Mac OS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。[/size]
[color=#f44336][size=5]|[/size][/color][size=4][b]正式版[/b]是 Minecraft Java 版经过一段时间的预览版测试后得到的稳定版本，也是众多纹理、Mod 与服务器插件会逐渐跟进的版本。官方启动器也会第一时间进行推送。 [/size]
[color=#f44336][size=5]|[/size][/color][size=4]建议玩家与服主关注其相关服务端、Mod 与插件的更新，迎接新的正式版吧！专注于单人原版游戏的玩家可立即更新，多人游戏玩家请关注您所在服务器的通知。[/size]
[color=#388e3c][size=5]|[/size][/font][/color][size=4]本文内容按照 [/font][/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][/font][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/font][/size][hr]\n`;

      case VersionType.BedrockRelease:
        return `[align=left][color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft 基岩版[/b]是指运行在移动平台（Android、iOS）、Windows 10、主机（Xbox One、Switch、PlayStation 4）上，使用「基岩引擎」（C++语言）开发的 Minecraft 版本。[/size][/align][/font][align=left][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][align=left][color=#f44336][size=5]|[/size][/color][size=4][b]正式版[/b]是 Minecraft 基岩版经过一段时间的测试版测试之后得到的稳定版本，也是众多纹理、Addon 和官方领域服会逐渐跟进的版本。与此同时 Google Play、Win10 Store 等官方软件商店也会推送此次更新。 [/size][/align][/font][align=left][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][/font][hr]\n`;

      case VersionType.BedrockBeta:
        return `[align=left][color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft 基岩版[/b]是指运行在移动平台（Android、iOS）、Windows 10、主机（Xbox One、Switch、PlayStation 4）上，使用「基岩引擎」（C++语言）开发的 Minecraft 版本。[/size][/align][align=left][color=#388e3c][size=5]|[/size][/color][size=4][b]测试版[/b]是 Minecraft 基岩版的测试机制，主要用于下一个正式版的特性预览。[/size][/align][/align][align=center][align=left][color=#f44336][size=5]|[/size][/color][size=4][b]然而，测试版主要用于新特性展示，通常存在大量漏洞。因此对于普通玩家建议仅做测试尝鲜用。使用测试版打开存档前请务必备份。适用于正式版的领域服务器与测试版不兼容。[/b] [/size][/align][/align][align=center][align=left][color=#f44336][size=5]|[/size][/color][size=4]如果在测试版中遇到旧版存档无法使用的问题，测试版将允许你将存档上传以供开发团队查找问题。[/size][/align][/align][align=center][align=left][color=#f44336][size=5]|[/size][/color][size=4]Minecraft 基岩版 <正式版版本号> 仍未发布，Beta & Preview <测试版版本号> 为其第 <计数> 个测试版。[/size][/align][/align][align=center][align=left][color=#388e3c][size=5]|[/size][/font][/color][size=4]本文内容按照 [/font][/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][/font][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/font][/size][/align][/align][/align][/align][hr]\n`;

      case VersionType.Normal:
      default:
        return `[align=left][color=#388e3c][size=5]|[/size][/font][/color][size=4]本文内容按照 [/font][/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][/font][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/font][/size][/align][/align][/align][/align][hr]\n`;
    }
  }
  function getFooter(articleType, type) {
    const time = new Date();

    function padTime(time) {
      return time.toString().padStart(2, '0');
    }

    function toHoursAndMinutes(totalMinutes) {
      const m = Math.abs(totalMinutes);
      const minutes = m % 60;
      const hours = Math.floor(m / 60);
      return `${totalMinutes < 0 ? '+' : '-'}${padTime(hours)}${padTime(minutes)}`;
    }

    const poweredBy = `[align=center][size=1][color=Silver]Powered by SPXXKLP ${spxxklpVersion} with love
Converted at ${time.getFullYear()}-${padTime(time.getMonth() + 1) // why +1 javascript
  }-${padTime(time.getDate())} ${padTime(time.getHours())}:${padTime(time.getMinutes())} ${toHoursAndMinutes(time.getTimezoneOffset())}[/color][/size][/align]`;
  
/*Same contents,change if necessary.**/

    switch (type) {
      case VersionType.Snapshot:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list][/indent]`;

      case VersionType.PreRelease:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list][/indent]`;

      case VersionType.ReleaseCandidate:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list][/indent]`;

      case VersionType.Release:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list][/indent]`;

      case VersionType.BedrockRelease:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list][/indent]`;

      case VersionType.BedrockBeta:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list][/indent]`;

      case VersionType.Normal:
      default:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list][/indent]`;
    }
  }
  let VersionType;

  (function (VersionType) {
    VersionType[VersionType["Snapshot"] = 0] = "Snapshot";
    VersionType[VersionType["PreRelease"] = 1] = "PreRelease";
    VersionType[VersionType["ReleaseCandidate"] = 2] = "ReleaseCandidate";
    VersionType[VersionType["Release"] = 3] = "Release";
    VersionType[VersionType["Normal"] = 4] = "Normal";
    VersionType[VersionType["BedrockBeta"] = 5] = "BedrockBeta";
    VersionType[VersionType["BedrockRelease"] = 6] = "BedrockRelease";
  })(VersionType || (VersionType = {}));

  const translators = {
    headings: (input, ctx) => {
      return translator(input, ctx, [// Minecraft.net titles
      [/Block of the Week: /gi, '本周方块：'], [/Taking Inventory: /gi, '背包盘点：'], [/Around the Block: /gi, '群系漫游：'], [/A Minecraft Java Snapshot/gi, 'Minecraft Java版 快照'], [/A Minecraft Java Pre-Release/gi, 'Minecraft Java版 预发布版'], [/A Minecraft Java Release Candidate/gi, 'Minecraft Java版 候选版本'], // Bedrock Edition titles
      [/Minecraft Beta (?:-|——) (.*?) \((.*?)\)/gi, 'Minecraft 基岩版 Beta $1（$2）'], [/Minecraft Beta & Preview - (.*?)/g, 'Minecraft 基岩版 Beta & Preview $1'], [/Minecraft (?:-|——) (.*?) \(Bedrock\)/gi, 'Minecraft 基岩版 $1'], [/Minecraft (?:-|——) (.*?) \((.*?) Only\)/gi, 'Minecraft 基岩版 $1（仅$2）'], [/Minecraft (?:-|——) (.*?) \((.*?)\)/gi, 'Minecraft 基岩版 $1（仅$2）'], // BE subheadings
      [/Marketplace/gi, '市场'], [/Data-Driven/gi, '数据驱动'], [/Graphical/gi, '图像'], [/Player/gi, '玩家'], [/Experimental Features/gi, '实验性特性'], [/Mobs/gi, '生物'], [/Features and Bug Fixes/gi, '特性和漏洞修复'], [/ADVANCEMENTS/gi, '进度'], [/Accessibility/gi, '辅助功能'], [/Gameplay/gi, '玩法'], [/Items/gi, '物品'], [/Blocks/gi, '方块'], [/User Interface/gi, '用户界面'], [/Commands/gi, '命令'], [/Known Issues/gi, '已知问题'], [/Character Creator/gi, '角色创建器'], [/Components/gi, '组件'], [/General/gi, '通用'], [/Technical Experimental Updates/gi, '实验性技术性更新'], [/Gametest Framework/gi, 'Gametest 框架'], [/Gametest Framework (experimental)/gi, 'Gametest 框架（实验性）'], // JE subheadings
      [/Minecraft Snapshot /gi, 'Minecraft 快照 '], [/ Pre-Release /gi, '-pre'], [/ Release Candidate /gi, '-rc'], [/Release Candidate/gi, '候选版本'], [/New Features in ([^\r\n]+)/gi, '$1 的新增特性'], [/Technical changes in ([^\r\n]+)/gi, '$1 的技术性修改'], [/Changes in ([^\r\n]+)/gi, '$1 的修改内容'], [/Fixed bugs in ([^\r\n]+)/gi, '$1 修复的漏洞'], [/STABILITY AND PERFORMANCE/gi, '性能与稳定性'], [/FEATURES AND BUG FIXES/gi, '特性和漏洞修复'],[/LOOT/gi, '战利品'], [/PARITY/gi, '趋同'], [/ADD-ONS AND SCRIPT ENGINE/gi, '附加包和脚本引擎'], [/DRESSING ROOM/gi, '更衣室'], [/Item/gi, '物品'], [/CHANGES/gi, '改动'], [/SOUNDS/gi, '音效'], [/DATA PACK VERSION/gi, '数据包版本'], [/PREDICATES/gi, '谓词'], [/ENTITY/gi, '实体'], [/ENCHANTMENTS/gi, '附魔'], [/TAGS/gi, '标签'], [/TYPE/gi, '类型'], [/MUSIC/gi, '音乐'], [/GAME TIPS/gi, '游戏提示'], [/NEW FEATURE/gi, '新特性'], [/USER INTERFACE/gi, '用户界面'], [/EDITOR/gi, '编辑器'], [/FIXES/gi, '修复'], [/IMPROVEMENTS/gi, '改进'], [/RESOURCE PACK VERSION/gi, '资源包版本'], [/SHADERS/gi, '着色器'], [/PARTICLES/gi, '粒子效果'], [/TOUCH CONTROLS/gi, '触控'], [/TECHNICAL UPDATES/gi, '技术性更新'], [/PROJECTILES/gi, '弹射物'], [/ENTITIES/gi, '实体'], [/FUNCTIONS/gi, '函数']]);
    },
    imgCredits: (input, ctx) => {
      return translator(input, ctx, [// Creative Commons image credits
      [/Image credit:/gi, '图片来源：'], [/CC BY-NC-ND/gi, '知识共享 署名-非商业性使用-禁止演绎'], [/CC BY-NC-SA/gi, '知识共享 署名-非商业性使用-相同方式共享'], [/CC BY-NC/gi, '知识共享 署名-非商业性使用'], [/CC BY-ND/gi, '知识共享 署名-禁止演绎'], [/CC BY-SA/gi, '知识共享 署名-相同方式共享'], [/CC BY/gi, '知识共享 署名'], [/Public Domain/gi, '公有领域']]);
    },
    punctuation: (input, ctx) => {
      return translator(input, ctx, [[/\[i\]/gi, '[font=楷体]'], [/\[\/i\]/g, '[/font]'], ...(ctx.disablePunctuationConverter ? [] : [[/,( |$)/g, '，'], [/!( |$)/g, '！'], [/\.\.\.( |$)/g, '…'], [/\.( |$)/g, '。'], [/\?( |$)/g, '？'], [/( |^)-( |$)/g, ' —— ']])], input => {
        return quoteTreatment(input, [['“', '”', /"/]]);
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: (input, ctx) => {
      return quoteTreatment(input, [['[backcolor=#f1edec][color=Silver][font=SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace][/font][/color][/backcolor]', '`', /`/]]);
    }
  };
  function translate(input, ctx, type) {
    if (typeof type === 'string') {
      type = [type];
    }

    for (const t of type) {
      input = translators[t](input, ctx);
    }

    return input;
  }

  function quoteTreatment(input, quoteArrays) {
    for (const quoteArray of quoteArrays) {
      const split = input.split(quoteArray[2]);
      input = '';

      for (let i = 0; i < split.length - 1; i++) {
        const element = split[i];
        input += element + quoteArray[i % 2];
      }

      input += split[split.length - 1];
    }

    return input;
  }

  function translator(input, ctx, mappings, treatment = input => input) {
    // REPLACE!!!!1
    for (const mapping of mappings) {
      input = input.replace(mapping[0], mapping[1]);
    }

    treatment(input, ctx);
    return input;
  }

  const converters = {
    /**
     * Converts a ChildNode to a BBCode string according to the type of the node.
     */
    convert: async (node, ctx) => {
      if (node.classList?.contains('spxxklp-userscript-ignored')) {
        return '';
      } // Listing all possible elements in the document


      switch (node.nodeName) {
        case 'A':
          return converters.a(node, ctx);

        case 'B':
        case 'STRONG':
          return converters.strong(node, ctx);

        case 'BLOCKQUOTE':
          return converters.blockquote(node, ctx);

        case 'BR':
          return converters.br();

        case 'CITE':
          return converters.cite(node, ctx);

        case 'CODE':
          return converters.code(node, ctx);

        case 'DIV':
        case 'SECTION':
          return converters.div(node, ctx);

        case 'DD':
          return converters.dd(node, ctx);

        case 'DL':
          return converters.dl(node, ctx);

        case 'DT':
          return converters.dt();

        case 'EM':
          return converters.em(node, ctx);

        case 'H1':
          return converters.h1(node, ctx);

        case 'H2':
          return converters.h2(node, ctx);

        case 'H3':
          return converters.h3(node, ctx);

        case 'H4':
          return converters.h4(node, ctx);

        case 'I':
          return converters.i(node, ctx);

        case 'IMG':
          return converters.img(node);

        case 'LI':
          return converters.li(node, ctx);

        case 'OL':
          return converters.ol(node, ctx);

        case 'P':
          return converters.p(node, ctx);

        case 'PICTURE':
          return converters.picture(node, ctx);

        case 'PRE':
          return converters.pre(node, ctx);

        case 'SPAN':
          return converters.span(node, ctx);

        case 'TABLE':
          return converters.table(node, ctx);

        case 'TBODY':
          return converters.tbody(node, ctx);

        case 'TH':
        case 'TD':
          return converters.td(node, ctx);

        case 'TR':
          return converters.tr(node, ctx);

        case 'UL':
          return converters.ul(node, ctx);

        case '#text':
          if (node) {
            if (ctx.multiLineCode) {
              return node.textContent ? node.textContent : '';
            } else return node.textContent.replace(/[\n\r\t]+/g, '').replace(/\s{2,}/g, '');
          } else {
            return '';
          }

        case 'BUTTON':
        case 'H5':
        case 'NAV':
        case 'svg':
        case 'SCRIPT':
          if (node) {
            return node.textContent ? node.textContent : '';
          } else {
            return '';
          }

        default:
          console.warn(`Unknown type: '${node.nodeName}'.`);

          if (node) {
            return node.textContent ? node.textContent : '';
          } else {
            return '';
          }

      }
    },

    /**
     * Convert child nodes of an HTMLElement to a BBCode string.
     */
    recurse: async (ele, ctx) => {
      let ans = '';

      if (!ele) {
        return ans;
      }

      for (const child of Array.from(ele.childNodes)) {
        ans += await converters.convert(child, ctx);
      }

      return ans;
    },
    a: async (anchor, ctx) => {
      const url = resolveUrl(anchor.href);
      let ans;

      if (url) {
        ans = `[url=${url}][color=#388d40][u]${await converters.recurse(anchor, ctx)}[/u][/color][/url]`;
      } else {
        ans = await converters.recurse(anchor, ctx);
      }

      return ans;
    },
    blockquote: async (ele, ctx) => {
      const prefix = '';
      const suffix = '';
      const ans = `${prefix}${await converters.recurse(ele, ctx)}${suffix}`;
      return ans;
    },
    br: async () => {
      const ans = '\n';
      return ans;
    },
    cite: async (ele, ctx) => {
      const prefix = '—— ';
      const suffix = '';
      const ans = `${prefix}${await converters.recurse(ele, ctx)}${suffix}`;
      return ans;
    },
    code: async (ele, ctx) => {
      const prefix = ctx.multiLineCode ? '[code]' : '[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]';
      const suffix = ctx.multiLineCode ? '[/code]' : '[/font][/color][/backcolor]';
      const ans = `${prefix}${await converters.recurse(ele, { ...ctx,
      disablePunctuationConverter: true
    })}${suffix}`;
      return ans;
    },
    div: async (ele, ctx) => {
      let ans = await converters.recurse(ele, ctx);

      if (ele.classList.contains('text-center')) {
        ans = `[/indent][/indent][align=center]${ans}[/align][indent][indent]\n`;
      } else if (ele.classList.contains('article-image-carousel')) {
        // Image carousel.

        /*
         * <div> .article-image-carousel
         *   <div> .slick-list
         *     <div> .slick-track
         *       * <div> .slick-slide [.slick-cloned]
         *           <div>
         *             <div> .slick-slide-carousel
         *               <img> .article-image-carousel__image
         *               <div> .article-image-carousel__caption
         */
        const slides = [];

        const findSlides = async ele => {
          if (ele.classList.contains('slick-cloned')) {
            return;
          }

          if (ele.nodeName === 'IMG' && ele.classList.contains('article-image-carousel__image')) {
            slides.push([resolveUrl(ele.src), ' ']);
          } else if (ele.nodeName === 'DIV' && ele.classList.contains('article-image-carousel__caption')) {
            if (slides.length > 0) {
              slides[slides.length - 1][1] = `[b]${await converters.recurse(ele, ctx)}[/b]`;
            }
          } else {
            for (const child of Array.from(ele.childNodes)) {
              if (child.nodeName === 'DIV' || child.nodeName === 'IMG') {
                await findSlides(child);
              }
            }
          }
        };

        await findSlides(ele);

        if (UselessFunction1(slides)) {
          ans = `[/indent][/indent][align=center]${slides.map(([url, caption]) => `[img]${url}[/img]\n`).join('\n')}[/align][indent][indent]\n`;
        } else if (slides.length > 0) {
          ans = `[/indent][/indent][align=center]${slides.map(([url, caption]) => `[img]${url}[/img]\n${caption}`).join('\n')}[/align][indent][indent]\n`;
        } else {
          ans = '';
        }
      } else if (ele.classList.contains('video')) {
        // Video.
        ans = '\n[/indent][/indent][align=center]<无法获取的视频，如有可用视频源，请在此处插入>\n<对于B站视频，可使用 [bilibili] 代码>[/align][indent][indent]\n';
      } else if (ele.classList.contains('quote') || ele.classList.contains('attributed-quote')) {
        ans = `\n[quote]\n${ans}\n[/quote]\n`;
      } else if (ele.classList.contains('article-social')) {
        // End of the content.
        ans = '';
      } else if (ele.classList.contains('modal')) {
        // Unknown useless content
        ans = '';
      } // else if (ele.classList.contains('end-with-block')) {
      //     ans = ans.trimRight() + '[img=16,16]https://ooo.0o0.ooo/2017/01/30/588f60bbaaf78.png[/img]'
      // }


      return ans;
    },
    dt: async () => {
      // const ans = `${converters.rescure(ele)}：`
      // return ans
      return '';
    },
    dl: async (ele, ctx) => {
      const ans = `\n\n${await converters.recurse(ele, ctx)}\n【本文排版借助了：[url=https://github.com/cinder0601/SPXXKLP][color=#388d40][u]SPXXKLP[/u][/color][/url] v${spxxklpVersion}】\n\n`;
      return ans;
    },
    dd: async (ele, ctx) => {
      let ans = '';

      if (ele.classList.contains('pubDate')) {
        // Published:
        // `pubDate` is like '2019-03-08T10:00:00.876+0000'.
        const date = ele.attributes.getNamedItem('data-value');

        if (date) {
          ans = `[b]【${ctx.translator} 译自[url=${ctx.url}][color=#388d40][u]官网 ${date.value.slice(0, 4)} 年 ${date.value.slice(5, 7)} 月 ${date.value.slice(8, 10)} 日发布的 ${ctx.title}[/u][/color][/url]；原作者 ${ctx.author}】[/b]`;
        } else {
          ans = `[b]【${ctx.translator} 译自[url=${ctx.url}][color=#388d40][u]官网 * 年 * 月 * 日发布的 ${ctx.title}[/u][/color][/url]】[/b]`;
        }
      } else {
        // Written by:
        ctx.author = await converters.recurse(ele, ctx);
      }

      return ans;
    },
    em: async (ele, ctx) => {
      const ans = `[i]${await converters.recurse(ele, ctx)}[/i]`;
      return ans;
    },
    h1: async (ele, ctx) => {
      const prefix = '[size=6][b]';
      const suffix = '[/b][/size]';
      const rawInner = await converters.recurse(ele, ctx);
      const inner = makeUppercaseHeader(rawInner);
      const ans = `${prefix}[color=Silver]${usingSilver(inner).replace(/[\n\r]+/g, ' ')}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, ['headings', 'punctuation']).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`;
      return ans;
    },
    h2: async (ele, ctx) => {
      if (isBlocklisted(ele.textContent)) return '';
      const prefix = '[size=5][b]';
      const suffix = '[/b][/size]';
      const rawInner = await converters.recurse(ele, ctx);
      const inner = makeUppercaseHeader(rawInner);
      const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(/[\n\r]+/g, ' ')}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, ['headings', 'punctuation']).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`;
      return ans;
    },
    h3: async (ele, ctx) => {
      const prefix = '[size=4][b]';
      const suffix = '[/b][/size]';
      const rawInner = await converters.recurse(ele, ctx);
      const inner = makeUppercaseHeader(rawInner);
      const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(/[\n\r]+/g, ' ')}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, ['headings', 'punctuation']).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`;
      return ans;
    },
    h4: async (ele, ctx) => {
      const prefix = '[size=3][b]';
      const suffix = '[/b][/size]';
      const rawInner = await converters.recurse(ele, ctx);
      const inner = makeUppercaseHeader(rawInner);
      const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(/[\n\r]+/g, ' ')}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, ['headings', 'punctuation']).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`;
      return ans;
    },
    i: async (ele, ctx) => {
      const ans = `[i]${await converters.recurse(ele, ctx)}[/i]`;
      return ans;
    },
    img: async img => {
      if (img.alt === 'Author image') {
        return '';
      }

      let w;
      let h;

      if (img.classList.contains('attributed-quote__image')) {
        // for in-quote avatar image
        h = 92;
        w = 53;
      } else if (img.classList.contains('mr-3')) {
        // for attributor avatar image
        h = 121;
        w = 82;
      }

      const prefix = w && h ? `[img=${w},${h}]` : '[img]';
      const imgUrl = resolveUrl(img.src);
      if (imgUrl === '') return ''; // in case of empty image

      let ans;

      if (img.classList.contains('attributed-quote__image') || img.classList.contains('mr-3')) {
        // Attributed quote author avatar.
        ans = `\n[float=left]${prefix}${imgUrl}[/img][/float]`;
      } else {
        ans = `\n\n[/indent][/indent][align=center]${prefix}${imgUrl}[/img][/align][indent][indent]\n`;
      }

      return ans;
    },
    li: async (ele, ctx) => {
      let ans;
      let nestedList = false;

      for (const child of ele.childNodes) {
        if (child.nodeName === 'OL' || child.nodeName === 'UL') {
          nestedList = true;
        }
      }

      if (nestedList) {
        // Nested lists.
        let theParagragh = '';
        let theList = '';
        let addingList = false;

        for (let i = 0; i < ele.childNodes.length - 1; i++) {
          let nodeName = ele.childNodes[i].nodeName;

          if (nodeName === 'OL' || nodeName === 'UL') {
            addingList = true;
          }

          if (!addingList) {
            const paragraghNode = await converters.convert(ele.childNodes[i], { ...ctx,
              inList: true
            });
            theParagragh = `${theParagragh}${paragraghNode}`;
          } else {
            const listNode = await converters.convert(ele.childNodes[i], { ...ctx,
              inList: true
            });
            theList = `${theList}${listNode}`;
          }
        }

        ans = `[*][color=Silver]${usingSilver(theParagragh)}[/color]\n[*]${translate(translateBugs(theParagragh, ctx), ctx, 'code')}\n${theList}`;
      } else if (isBlocklisted(ele.textContent)) {
        return '';
      } else {
        const inner = await converters.recurse(ele, { ...ctx,
          inList: true
        });
        ans = `[*][color=Silver]${usingSilver(inner)}[/color]\n[*]${translate(translateBugs(inner, ctx), ctx, 'code')}\n`;
      }

      return ans;
    },
    ol: async (ele, ctx) => {
      const inner = await converters.recurse(ele, ctx);
      const ans = `[list=1]\n${inner}[/list]\n`;
      return ans;
    },
    p: async (ele, ctx) => {
      const inner = await converters.recurse(ele, ctx);
      let ans;

      if (ele.classList.contains('lead')) {
        ans = `[size=4][b][size=2][color=Silver]${inner}[/color][/size][/b][/size]\n[size=4][b]${translate(inner, ctx, 'headings')}[/b][/size]\n\n`;
      } else if (ele.querySelector('strong') !== null && ele.querySelector('strong').textContent === 'Posted:') {
        return '';
      } else if (isBlocklisted(ele.textContent)) {
        return '';
      } else if (ele.innerHTML === '&nbsp;') {
        return '\n';
      } else if (/\s{0,}/.test(ele.textContent) && ele.querySelectorAll('img').length === 1) {
        return inner;
      } else {
        if (ctx.inList) {
          ans = inner;
        } else {
          ans = `[size=2][color=Silver]${usingSilver(inner)}[/color][/size]\n${translate(inner, ctx, ['punctuation', 'imgCredits'])}\n\n`;
        }
      }

      return ans;
    },
    picture: async (ele, ctx) => {
      const ans = await converters.recurse(ele, ctx);
      return ans;
    },
    pre: async (ele, ctx) => {
      const ans = await converters.recurse(ele, { ...ctx,
        multiLineCode: true
      });
      return ans;
    },
    span: async (ele, ctx) => {
      const ans = await converters.recurse(ele, ctx);

      if (ele.classList.contains('bedrock-server')) {
        // Inline code.
        const prefix = '[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]';
        const suffix = '[/font][/color][/backcolor]';
        return `${prefix}${await converters.recurse(ele, { ...ctx,
        disablePunctuationConverter: true
      })}${suffix}`;
      } else if (ele.classList.contains('strikethrough')) {
        // Strikethrough text.
        const prefix = '[s]';
        const suffix = '[/s]';
        return `${prefix}${ans}${suffix}`;
      } else if (ele.childElementCount === 1 && ele.firstElementChild.nodeName === 'IMG') {
        // Image.
        const img = ele.firstElementChild;
        return await converters.img(img);
      }

      return ans;
    },
    strong: async (ele, ctx) => {
      const ans = `[b]${await converters.recurse(ele, ctx)}[/b]`;
      return ans;
    },
    table: async (ele, ctx) => {
      const ans = `\n[table]\n${await converters.recurse(ele, ctx)}[/table]\n`;
      return ans;
    },
    tbody: async (ele, ctx) => {
      const ans = await converters.recurse(ele, ctx);
      return ans;
    },
    td: async (ele, ctx) => {
      const ans = `[td]${await converters.recurse(ele, ctx)}[/td]`;
      return ans;
    },
    tr: async (ele, ctx) => {
      const ans = `[tr]${await converters.recurse(ele, ctx)}[/tr]\n`;
      return ans;
    },
    ul: async (ele, ctx) => {
      const inner = await converters.recurse(ele, ctx);
      const ans = `[list]\n${inner}[/list]\n`;
      return ans;
    }
  };
  /**
   * Resolve relative URLs.
   */

  function resolveUrl(url) {
    if (url[0] === '/') {
      return `https://${location.host}${url}`;
    } else {
      return url;
    }
  }
  function usingSilver(text) {
    return text.replace(/#388d40/g, 'Silver').replace(/#7824c5/g, 'Silver');
  }
  function makeUppercaseHeader(header) {
    let retStr = '';
    let idx = 0;
    let bracket = 0;

    for (let i = 0; i < header.length; i++) {
      if (header[i] == '[') {
        if (bracket == 0) {
          retStr = retStr.concat(header.substring(idx, i).toUpperCase());
          idx = i;
        }

        bracket++;
      } else if (header[i] == ']') {
        if (bracket <= 1) {
          retStr = retStr.concat(header.substring(idx, i + 1));
          idx = i + 1;
        }

        bracket = Math.max(0, bracket - 1);
      }
    }

    if (bracket > 0) {
      console.error('bracket not closed!');
      retStr = retStr.concat(header.substring(idx, header.length));
    } else {
      retStr = retStr.concat(header.substring(idx, header.length).toUpperCase());
    }

    return retStr;
  }
  /**
   * Get bugs from BugCenter.
   * Guangyao and github source are down, so I deleted them.
   */

  async function getBugs() {
    return new Promise((rs, rj) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: bugsCenter,
        fetch: true,
        nocache: true,
        timeout: 7_000,
        onload: r => {
          try {
            rs(JSON.parse(r.responseText));
          } catch (e) {
            rj(e);
          }
        },
        onabort: () => rj(new Error('Aborted')),
        onerror: e => rj(e),
        ontimeout: () => rj(new Error('Time out'))
      });
    });
  }
  async function getBugsTranslators() {
    return new Promise((rs, rj) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: bugsTranslatorsTable,
        fetch: true,
        nocache: true,
        timeout: 7_000,
        onload: r => {
          try {
            rs(JSON.parse(r.responseText));
          } catch (e) {
            rj(e);
          }
        },
        onabort: () => rj(new Error('Aborted')),
        onerror: e => rj(e),
        ontimeout: () => rj(new Error('Time out'))
      });
    });
  }
  async function getTranslatorColor() {
    return new Promise((rs, rj) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: translatorColorTable,
        fetch: true,
        nocache: true,
        timeout: 7_000,
        onload: r => {
          try {
            rs(JSON.parse(r.responseText));
          } catch (e) {
            rj(e);
          }
        },
        onabort: () => rj(new Error('Aborted')),
        onerror: e => rj(e),
        ontimeout: () => rj(new Error('Time out'))
      });
    });
  }

  function markdownToBbcode(value) {
    return value.replace(/`([^`]+)`/g, '[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]$1[/font][/color][/backcolor]');
  }
  /**
   * Replace untranslated bugs.
   */


  function translateBugs(str, ctx) {
    if (str.startsWith('[url=https://bugs.mojang.com/browse/MC-') && ctx.bugs != null // nullish
    ) {
      const id = str.slice(36, str.indexOf(']'));
      const data = ctx.bugs[id];

      if (data) {
        let bugColor = '#388d40';

        if (ctx.bugsTranslators[id]) {
          const bugTranslator = ctx.bugsTranslators[id];

          if (ctx.translatorColor[bugTranslator]) {
            bugColor = ctx.translatorColor[bugTranslator];
          }
        }

        const bbcode = markdownToBbcode(data);
        return `[url=https://bugs.mojang.com/browse/${id}][b][color=${bugColor}]${id}[/color][/b][/url]- ${bbcode}`;
      } else {
        return str;
      }
    } else {
      return str;
    }
  }
  /**
   * KLPBBS does NOT support [album], the shouldUseAlbum function is replaced by UselessFunction1.
   */


  function UselessFunction1(slides) {
    return slides.length > 1 && slides.every(([_, caption]) => caption === ' ')
    ; // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //  slides.every(([_, caption]) => caption === ' ')
  }

  function isBlocklisted(text) {
    const blocklist = ['Information on the Minecraft Preview and Beta:', 'While the version numbers between Preview and Beta are different, there is no difference in game content', 'These work-in-progress versions can be unstable and may not be representative of final version quality', 'Minecraft Preview is available on Xbox, Windows 10/11, and iOS devices. More information can be found at aka.ms/PreviewFAQ', 'The beta is available on Android (Google Play). To join or leave the beta, see aka.ms/JoinMCBeta for detailed instructions'];
    return blocklist.map(i => {
      return i.replace(/\p{General_Category=Space_Separator}*/, '');
    }).some(block => text.trim().trim().replace(/\p{General_Category=Space_Separator}*/, '').includes(block));
  }

  async function minecraftNet() {
    const url = document.location.toString();

    if (url.match(/^https:\/\/www\.minecraft\.net\/(?:[a-z-]+)\/article\//)) {
      const pointerModifier = document.getElementsByClassName('article-attribution-container').item(0);
      pointerModifier.style.pointerEvents = 'inherit';
      const button = document.createElement('button');
      button.classList.add('mc-button__primary', 'mc-button__green-s1', 'spxxklp-userscript-ignored');
      button.innerText = '复制 BBCode';

      button.onclick = async () => {
        button.innerText = '处理中...';
        const bbcode = await convertMCArticleToBBCode(document, url);
        GM_setClipboard(bbcode, {
          type: 'text',
          mimetype: 'text/plain'
        });
        button.innerText = '已复制 BBCode!';
        setTimeout(() => button.innerText = '复制 BBCode', 5_000);
      };

      const container = document.getElementsByClassName('attribution').item(0);
      container.append(button);
    }
  }

  async function convertMCArticleToBBCode(html, articleUrl, translator = config.translator) {
    const articleType = getArticleType(html);
    const versionType = getVersionType(articleUrl);
    let bugs;

    try {
      bugs = await getBugs();
    } catch (e) {
      bugs = {};
      console.error('[convertMCArticleToBBCode#getBugs]', e);
    }

    let bugsTranslators;

    try {
      bugsTranslators = await getBugsTranslators();
    } catch (e) {
      bugsTranslators = {};
      console.error('[convertMCArticleToBBCode#getBugs]', e);
    }

    let translatorColor;

    try {
      translatorColor = await getTranslatorColor();
    } catch (e) {
      translatorColor = {};
      console.error('[convertMCArticleToBBCode#getBugs]', e);
    }

    const header = getHeader(articleType, versionType);
    const heroImage = getHeroImage(html, articleType);
    const content = await getContent(html, {
      bugs,
      bugsTranslators,
      translatorColor,
      title: html.title.split(' | ').slice(0, -1).join(' | '),
      date: null,
      translator,
      url: articleUrl
    });
    const footer = getFooter(articleType, versionType);
    const ans = `${header}${heroImage}${content}[/indent][/indent]${footer}`;
    return ans;
  }
  /**
   * Returns the type of the article.
   */


  function getArticleType(html) {
    try {
      const type = html.getElementsByClassName('article-category__text')?.[0]?.textContent ?? '';
      return type.toUpperCase();
    } catch (e) {
      console.error('[getArticleType]', e);
    }

    return 'INSIDER';
  }

  function getVersionType(url) {
    if (url.toLowerCase().includes('pre-release')) {
      return VersionType.PreRelease;
    } else if (url.toLowerCase().includes('release-candidate')) {
      return VersionType.ReleaseCandidate;
    } else if (url.toLowerCase().includes('snapshot')) {
      return VersionType.Snapshot;
    } else if (url.toLowerCase().includes('minecraft-java-edition')) {
      return VersionType.Release;
    } else if (url.toLowerCase().includes('minecraft-preview'||'minecraft-beta-preview'||'minecraft-beta')) {
      return VersionType.BedrockBeta;
    } else {
      return VersionType.Normal;
    }
  }
  /**
   * Get the hero image (head image) of an article as the form of a BBCode string.
   * @param html An HTML Document.
   */


  function getHeroImage(html, articleType) {
    const category = articleType ? `\n[backcolor=Black][color=White][font="Noto Sans",sans-serif][b]${articleType}[/b][/font][/color][/backcolor][/align]` : '';
    const img = html.getElementsByClassName('article-head__image')[0];

    if (!img) {
      return `\n[align=center]${category}[indent][indent]\n`;
    }

    const src = img.src;
    const ans = `[align=center][img=1200,513]${resolveUrl(src)}[/img]\n${category}[indent][indent]\n`;
    return ans;
  }
  /**
   * Get the content of an article as the form of a BBCode string.
   * @param html An HTML Document.
   */


  async function getContent(html, ctx) {
    const rootDiv = html.getElementsByClassName('article-body')[0];
    let ans = await converters.recurse(rootDiv, ctx); // Get the server URL if it exists.

    const serverUrls = ans.match(/(https:\/\/piston-data.mojang.com\/.+\/server.jar)/);
    let serverUrl = '';

    if (serverUrls) {
      serverUrl = serverUrls[0];
    } // Remove the text after '】'


    ans = ans.slice(0, ans.lastIndexOf('】') + 1); // Remove 'GET THE SNAPSHOT/PRE-RELEASE/RELEASE-CANDIDATE/RELEASE' for releasing

    let index = ans.toLowerCase().search(/\[size=\d]\[b\]\[color=silver\](\[b\])?get the (pre-release|release|release candidate|snapshot)(\[\/b\])?\[\/color\]\[\/b\]\[\/size\]/);

    if (index !== -1) {
      ans = ans.slice(0, index);

      const attribution = await converters.recurse(document.querySelector('.attribution'), ctx);
      ans = `${ans}${attribution}`;
    } // Add spaces between texts and '[x'.


    ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, '$1 $2'); // Add spaces between '[/x]' and texts.

    ans = ans.replace(/(\[\/[^\]]+?\])([a-zA-Z0-9\-._])/g, '$1 $2'); // Append the server URL if it exists.

    return ans;
  }

  function getZendesk(controlDOM, titleSlice, contentClass, versionType) {
    const button = document.createElement('a');
    button.classList.add('navLink');
    button.innerText = '复制 BBCode';

    button.onclick = async () => {
      button.innerText = '处理中...';
      const bbcode = await convertZendeskArticleToBBCode(document, location.href, config.translator, titleSlice, contentClass, versionType);
      GM_setClipboard(bbcode, {
        type: 'text',
        mimetype: 'text/plain'
      });
      button.innerText = '已复制 BBCode!';
      setTimeout(() => button.innerText = '复制 BBCode', 5_000);
    };

    controlDOM(button);
  }

  async function convertZendeskArticleToBBCode(html, articleUrl, translator = config.translator, titleSlice, contentClass, versionType) {
    const title = html.title.slice(0, html.title.lastIndexOf(titleSlice));
    const ctx = {
      bugs: {},
      title: title,
      date: null,
      translator,
      url: articleUrl
    };
    const content = await getZendeskContent(html, ctx, contentClass);
    const posted = await getZendeskDate(location.href);
    const header = versionType ? getHeader('news', versionType) : '';
    const footer = versionType ? getFooter('news', versionType) : '';
    const ans = `${header}[align=center][size=6][b][color=Silver]${title}[/color][/b][/size]
${translate(`[size=6][b]${title}[/b][/size]`, ctx, 'headings')}[/align]\n\n[indent][indent]${content}\n
[b]【${ctx.translator} 译自[url=${ctx.url}][color=#388d40][u]${ctx.url.match(/https:\/\/(.*?)\//)[1]} ${posted.year} 年 ${posted.month} 月 ${posted.day} 日发布的 ${ctx.title}[/u][/color][/url]】[/b]
【本文排版借助了：[url=https://github.com/cinder0601/SPXXKLP][color=#388d40][u]SPXXKLP[/u][/color][/url] Userscript v${spxxklpVersion}】[/indent][/indent]\n\n${footer}`;
    return ans;
  }

  async function getZendeskContent(html, ctx, contentClass) {
    const rootSection = html.getElementsByClassName(contentClass)[0]; // Yep, this is the only difference.

    let ans = await converters.recurse(rootSection, ctx); // Add spaces between texts and '[x'.

    ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, '$1 $2'); // Add spaces between '[/x]' and texts.

    ans = ans.replace(/(\[\/[^\]]+?\])([a-zA-Z0-9\-._])/g, '$1 $2');
    return ans;
  }

  async function getZendeskDate(url) {
    const req = new Promise((rs, rj) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: '/api/v2/help_center/en-us/articles/' + url.match(/\/articles\/(\d+)/)[1],
        fetch: true,
        nocache: true,
        timeout: 7_000,
        onload: r => {
          try {
            rs(r.responseText);
          } catch (e) {
            rj(e);
          }
        },
        onabort: () => rj(new Error('Aborted')),
        onerror: e => rj(e),
        ontimeout: () => rj(new Error('Time out'))
      });
    });
    let res;
    await req.then(value => {
      const rsp = JSON.parse(value);
      res = new Date(rsp.article.created_at);
    });
    const year = res.getFullYear();
    const month = res.getMonth() + 1;
    const day = res.getDate();
    return {
      year,
      month,
      day
    };
  }

  function feedback() {
    let versionType = VersionType.Normal;

    if (document.querySelector('[title="Beta and Preview Information and Changelogs"]')) {
      versionType = VersionType.BedrockBeta;
    } else if (document.querySelector('[title="Release Changelogs"]')) {
      versionType = VersionType.BedrockRelease;
    }

    getZendesk(button => {
      document.querySelector('.topNavbar nav').append(button);
    }, ' – Minecraft Feedback', 'article-info', versionType);
  }

  function help() {
    getZendesk(button => {
      const nav = document.createElement('nav');
      nav.classList.add('my-0');
      nav.append(button);
      document.querySelector('.topNavbar .d-flex').append(nav);
    }, ' – Home', 'article-body', null);
  }
  function twitter() {
    const ProfilePictures = new Map([
      ['Mojang', 'https://s2.loli.net/2024/05/27/tMZKe4BmldgDv2P.jpg'],
      ['MojangSupport', 'https://s2.loli.net/2024/05/27/tMZKe4BmldgDv2P.jpg'],
      ['MojangStatus', 'https://s2.loli.net/2024/05/27/tMZKe4BmldgDv2P.jpg'],
      ['Minecraft', 'https://s2.loli.net/2024/05/27/6QsES9CwgKMLv7I.jpg'],
      ['henrikkniberg', 'https://s2.loli.net/2024/05/27/h2KGZEBks4XMTFq.png'],
      ['_LadyAgnes', 'https://s2.loli.net/2024/05/27/ZoJsth1i8randl9.png'],
      ['kingbdogz', 'https://s2.loli.net/2024/05/27/IH7aVTepiDXBZb2.png'],
      ['JasperBoerstra', 'https://s2.loli.net/2024/05/27/Jh2doD1eG7A56TR.png'],
      ['adrian_ivl', 'https://s2.loli.net/2024/05/27/itAL8hsGqk67cxS.png'],
      ['slicedlime', 'https://s2.loli.net/2024/05/27/DY6gQscuX8HiA9e.jpg'],
      ['Cojomax99', 'https://s2.loli.net/2024/05/27/DxeZ3rINFgTildA.png'],
      ['Mojang_Ined', 'https://s2.loli.net/2024/05/27/dzX3pYy8TSa7uJt.png'],
      ['SeargeDP', 'https://s2.loli.net/2024/05/27/nf7EKltTYXLgsxN.png'],
      ['Dinnerbone', 'https://s2.loli.net/2024/05/27/Q4ebCE29vFwPmxn.png'],
      ['Marc_IRL', 'https://s2.loli.net/2024/05/27/bcW5zXfQ84r9IO6.png'],
      ['Mega_Spud', 'https://s2.loli.net/2024/05/27/TZwzsJBRhnLyuFx.png'],
      ['CornerHardMC', 'https://s2.loli.net/2024/05/28/o4wLCvuRGi9Yxh7.png'],
  ]);//More pictures can be added manually.
  function getTweetMetadata() {
      const tweetMetadata = {
          date: '',
          source: '',
          text: '',
          rawtext: '',
          tweetLink: '',
          urls: '',
          userName: '',
          userTag: '',
          lang: '',
      };
      const url = window.location.href;
      const regex = /https:\/\/x\.com\/([^/]+)\/status\/\d+/;
      const match = url.match(regex);
      tweetMetadata.userTag = match[1];
      let posterNameContent = [];
      const posterNameElements = document.querySelector('div[data-testid="User-Name"] a span').querySelectorAll('span, img[alt]');
      for (const element of posterNameElements) {
        if (element.tagName.toLowerCase() === 'span') {
          posterNameContent.push(element.textContent);
        } else if (element.tagName.toLowerCase() === 'img' && element.alt) {
          posterNameContent.push(element.alt);
        }
      }
      tweetMetadata.userName = posterNameContent.join('');
      let texts = [];
      let rawTexts = [];
      const articleDivs = document.querySelector('article div[lang]').querySelectorAll('span, img[alt]');
      for (const element of articleDivs) {
        let textContent = '';
        let rawContent = '';
        if (element.tagName.toLowerCase() === 'span') {
          textContent = element.innerHTML;
          rawContent = element.textContent;
          const links = element.querySelectorAll('a');
          links.forEach(link => {
            const url = link.href;
            const linkText = link.innerText.trim();
            const replacement = `[url=${url}][color=#00bfff][u]${linkText}[/u][/color][/url]`;
            textContent = textContent.replace(link.outerHTML, replacement);
            rawContent = rawContent.replace(link.outerHTML, linkText);
          });
        } else if (element.tagName.toLowerCase() === 'img' && element.alt) {
          textContent = element.alt;
          rawContent = element.alt;
        }
        texts.push(textContent);
        rawTexts.push(rawContent.replace(/<a.*?>(.*?)<\/a>/g, '$1'));
      }
      tweetMetadata.text = texts.join('');
      tweetMetadata.rawtext = rawTexts.join('');
      //I have tried my best but failed, if it still returns 'http://' or 'https://', please add the link manually.
      tweetMetadata.lang = document.querySelector('article div[lang]').getAttribute('lang');
      tweetMetadata.date = document.querySelector('time').innerHTML;
      tweetMetadata.source = document.querySelector('article a[role="link"] span').innerText;
      tweetMetadata.tweetLink = window.location.href;

      return tweetMetadata;
  }

  function getTweetBbcode(tweet, mode) {
      const attributeColor = '#5B7083';
      const backgroundColor = mode === 'dark' ? '#000000' : '#FFFFFF';
      const foregroundColor = mode === 'dark' ? '#D9D9D9' : '#0F1419';
      const dateString = `${tweet.date} · ${tweet.source} · SPXXKLP v${spxxklpVersion} · 转载请注明原作者及本帖地址`;
      const content = tweet.text;
      const content1 = tweet.rawtext;

      return `[align=center][table=560,${backgroundColor}]
  [tr][td][font=-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif][indent]
  [float=left][img=44,44]${ProfilePictures.get(tweet.userTag) || '<不支持的头像，请手动添加图片链接>'}[/img][/float][size=15px][b][color=${foregroundColor}]${tweet.userName}[/color][/b]
[color=${attributeColor}]@${tweet.userTag}[/color][/size]

[color=Silver][size=23px]${content1}[/color][/size]
  
[size=15px][color=${attributeColor}]由 ${GM_config.get('translator')} 翻译自${tweet.lang.startsWith('en') ? '英语' : ` ${tweet.lang}`}[/color][/size]

[color=${foregroundColor}][size=23px]${content}[/size]
  [/size][/color][/indent][align=center]<如有配图，请在此处添加>[/align]
  [indent][size=15px][url=${tweet.tweetLink}][color=${attributeColor}][u]${dateString}[/u][/color][/url][/size][/indent][/font][/td][/tr]
  [/table][/align]`;
  }

  function x() {
      console.info('[SPXXKLP] Activated');

      const buttonLight = document.createElement('button');
      buttonLight.innerText = '复制 BBCode (浅色)';
      buttonLight.style.width = '100%';
      buttonLight.onclick = async () => {
          buttonLight.innerText = '处理中...';
          try {
              const bbcode = getTweetBbcode(getTweetMetadata(), 'light');
              GM_setClipboard(bbcode, { type: 'text', mimetype: 'text/plain' });
              buttonLight.innerText = '已复制 BBCode!';
          } catch (error) {
              console.error("Error processing BBCode (Light):", error);
              buttonLight.innerText = '错误!';
          }
          setTimeout(() => buttonLight.innerText = '复制 BBCode (浅色)', 5000);
      };

      const buttonDark = document.createElement('button');
      buttonDark.innerText = '复制 BBCode (深色)';
      buttonDark.style.width = '100%';
      buttonDark.onclick = async () => {
          buttonDark.innerText = '处理中...';
          try {
              const bbcode = getTweetBbcode(getTweetMetadata(), 'dark');
              GM_setClipboard(bbcode, { type: 'text', mimetype: 'text/plain' });
              buttonDark.innerText = '已复制 BBCode!';
          } catch (error) {
              console.error("Error processing BBCode (Dark):", error);
              buttonDark.innerText = '错误!';
          }
          setTimeout(() => buttonDark.innerText = '复制 BBCode (深色)', 5000);
      };

      const checkLoaded = setInterval(() => {
          const targetDiv = document.querySelector('article div[lang]');
          if (targetDiv && !document.querySelector('#spxxklp-buttons')) {
              const container = document.createElement('div');
              container.id = 'spxxklp-buttons';
              container.style.display = 'flex';
              container.style.flexDirection = 'column';
              container.style.width = '100%';
              container.style.justifyContent = 'flex-end';
              buttonLight.style.backgroundColor = 'rgb(29, 155, 240)';
              buttonDark.style.backgroundColor = 'rgb(29, 155, 240)';
              buttonLight.style.borderColor = 'rgba(100, 149, 237, 0.5)';
              buttonDark.style.borderColor = 'rgba(100, 149, 237, 0.5)';
              buttonLight.style.borderRadius = '10px';
              buttonDark.style.borderRadius = '10px';
              buttonLight.style.textAlign = 'center';
              buttonDark.style.textAlign = 'center';
              buttonLight.style.marginLeft = 'auto';
              buttonDark.style.marginLeft = 'auto';
              buttonLight.style.width = '180px';
              buttonLight.style.height = '25px';
              buttonDark.style.width = '180px';
              buttonDark.style.height = '25px';
              container.append(buttonLight);
              container.append(buttonDark);
              targetDiv.parentElement.append(container);
              clearInterval(checkLoaded);
          }
      }, 300);
  }

  // Ensure the script runs after the page is fully loaded
  window.addEventListener('load', x);
  }
  switch (location.host) {
    case 'www.minecraft.net':
      minecraftNet();
      break;

    case 'x.com':
      twitter();
    break;

    case 'feedback.minecraft.net':
      feedback();
      break;

    case 'help.minecraft.net':
      help();
  }

})();
//# sourceMappingURL=bundle.user.js.map
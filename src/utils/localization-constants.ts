export const LocalizationConstants = {
  ribbon: {
    tooltip: "中文小说写作助手"
  },
  settings: {
    language: {
      name: "界面语言",
      desc: "选择插件使用的语言。",
      option: {
        zh_cn: "简体中文",
        zh_tw: "繁體中文"
      }
    },
    search: {
      placeholder: "搜索设置项",
      clear: "清空搜索",
      no_results: "没有匹配的设置项"
    },
    tab: {
      global: "全局",
      guidebook: "设定",
      annotation: "批注",
      sticky_note: "便签",
      proofread: "纠错",
      snippet: "补全",
      typeset: "排版",
      other: "其他",
      coming_soon: "该功能开发中。"
    },
    global: {
      section: {
        novel_library: "小说库"
      },
      novel_library: {
        add: {
          name: "添加新小说库",
          desc: "添加时，会自动创建设定库、便签库、片段库和纠错词库",
          placeholder: "输入小说库路径"
        },
        exists: "该小说库已存在",
        missing: "（已丢失）",
        create_subdirs_failed: "创建小说库目录失败，请检查路径是否有效",
        delete_confirm: {
          title: "确认删除小说库",
          message: "确定删除这个小说库配置吗？仅移除配置，不会删除实际文件夹。"
        }
      }
    },
    common: {
      add: "添加",
      delete: "删除",
      confirm: "确定",
      cancel: "取消"
    },
    other: {
      section: {
        common: "通用",
        word_count: "字数统计",
        generate_chapter: "生成章节",
        timeline: "时间轴"
      },
      chapter_name_format: {
        name: "章节名格式",
        desc: "用于新建章节文件名，支持 {num}、{num:N}（如 {num:3}）代表显示为3位数字"
      },
      open_file_in_new_tab: {
        name: "文件在新标签页打开",
        desc: "通过插件内相关功能打开或新建文件时，是否在新标签页打开（已打开则复用现有标签）"
      },
      enable_character_count: {
        name: "启用字数统计",
        desc: "关闭后不显示统计，且不在后台执行字符统计"
      },
      enable_character_milestone: {
        name: "启用字数里程碑",
        desc: "开启后，在编辑区行号右侧显示累计字数里程碑（每500字）"
      },
      count_only_novel_library: {
        name: "仅统计小说库（正文目录）",
        desc: "开启后仅统计文件夹对应关系中配置的小说库（正文目录）；状态栏字数统计不受影响"
      },
      timeline: {
        enable: {
          name: "启用时间轴",
          desc: "开启后，右边栏显示时间轴视图"
        }
      }
    },
    snippet: {
      section: {
        main: "片段补全",
        punctuation: "标点补全"
      },
      quick_insert: {
        enable: {
          name: "启用 // 快速输入现有设定",
          desc: "输入 // + 中文关键字时，从设定库中匹配设定候选词"
        },
        page_size: {
          name: "每页最多显示项数",
          desc: "候选框分页显示，每页最多显示的候选词数量"
        }
      },
      text_fragment: {
        enable: {
          name: "启用 // 文本片段",
          desc: "输入 // + 英文关键字时，从片段库的文本片段中匹配"
        }
      },
      punctuation: {
        auto_complete_pair: {
          name: "中文标点成对补齐",
          desc: "输入前半中文标点时自动补齐后半标点，光标保持在中间"
        }
      }
    },
    sticky_note: {
      section: {
        main: "便签"
      },
      enable: {
        name: "启用便签",
        desc: "开启后，右边栏显示便签视图"
      },
      default_rows: {
        name: "便签默认行数",
        desc: "设置便签预览默认显示行数（缩并时会自动展开）"
      },
      tag_hint: {
        name: "标签栏文字提示",
        desc: "关闭后，标签栏空状态不显示示例提示文字"
      }
    },
    annotation: {
      section: {
        main: "批注"
      },
      enable: {
        name: "启用批注",
        desc: "开启后，右边栏显示批注视图，并在编辑器右键菜单中启用创建批注"
      },
      auto_locate: {
        name: "切换文件自动定位",
        desc: "切换右侧编辑区文件时，批注栏自动定位到该文件第一条批注（无则定位列表最后一条）"
      }
    },
    guidebook: {
      section: {
        keyword_highlight: "关键字高亮样式",
        preview: "预览栏设置",
        other_features: "其他功能"
      },
      keyword: {
        mode: {
          name: "高亮模式",
          desc: "选择关键字的高亮方式",
          option: {
            first: "首次高亮",
            all: "全部高亮"
          }
        },
        background: {
          name: "背景色",
          desc: "高亮关键字的背景颜色（支持8位HEX，如 #FFFFFF00，最后两位为透明度）"
        },
        underline_style: {
          name: "下划线样式",
          desc: "高亮关键字的下划线样式",
          option: {
            none: "无线条",
            solid: "实线",
            dashed: "虚线",
            dotted: "点线",
            double: "双线",
            wavy: "波浪线"
          }
        },
        underline_width: {
          name: "下划线粗细",
          desc: "高亮关键字的下划线粗细（0-10像素）"
        },
        underline_color: {
          name: "下划线颜色",
          desc: "高亮关键字的下划线颜色"
        },
        font_weight: {
          name: "字体粗细",
          desc: "高亮关键字的字体粗细",
          option: {
            normal: "正常",
            bold: "加粗"
          }
        },
        font_style: {
          name: "字体样式",
          desc: "高亮关键字的字体样式",
          option: {
            normal: "正常",
            italic: "斜体"
          }
        },
        text_color: {
          name: "文字颜色",
          desc: "高亮关键字的文字颜色（支持8位HEX，如 #4A86E9ff，inherit表示继承原有颜色）"
        }
      },
      preview: {
        main_hover: {
          name: "正文悬停预览",
          desc: "开启后，鼠标悬停正文高亮关键字时显示预览栏"
        },
        sidebar_hover: {
          name: "右边栏悬停预览",
          desc: "开启后，鼠标悬停右边栏时显示预览栏"
        },
        width: {
          name: "预览栏宽度",
          desc: "悬停预览栏宽度（像素）"
        },
        max_lines: {
          name: "下方内容最多显示行数",
          desc: "显示行数，超出行数会显示滚动条"
        }
      },
      other: {
        western_name_auto_alias: {
          name: "西方人名自动别名",
          desc: "开启后，名称包含“·”的设定会自动将第一个“·”前的文字作为别名（如：劳勃·拜拉席恩 → 劳勃）"
        }
      }
    },
    typeset: {
      enable: {
        name: "启用编辑区排版",
        desc: "关闭后不应用行首缩进、行间距和段间距"
      },
      indent: {
        name: "行首缩进（中文字符）",
        desc: "仅编辑视图生效，按中文字符宽度缩进"
      },
      line_spacing: {
        name: "行间距",
        desc: "仅编辑视图生效"
      },
      paragraph_spacing: {
        name: "段间距",
        desc: "仅编辑视图生效；与行间距独立，不叠加"
      },
      section: {
        typeset: "排版",
        beautify: "美化"
      },
      beautify: {
        heading_icon: {
          name: "编辑区标题图标",
          desc: "在编辑视图各级标题前显示对应等级图标"
        },
        justify: {
          name: "两端对齐",
          desc: "开启后编辑区正文使用两端对齐，并启用自动断词"
        }
      }
    },
    proofread: {
      section: {
        common: "常见标点检测",
        custom: "自定义错别字与敏感词检测"
      },
      common: {
        enable: {
          name: "启用常见标点检测",
          desc: "仅在已配置默认库中的 Markdown 文件内进行检测"
        },
        english_comma: {
          name: "检测英文逗号（,）"
        },
        english_period: {
          name: "检测英文句号（.）"
        },
        english_colon: {
          name: "检测英文冒号（:）"
        },
        english_semicolon: {
          name: "检测英文分号（;）"
        },
        english_exclamation: {
          name: "检测英文感叹号（!）"
        },
        english_question: {
          name: "检测英文问号（?）"
        },
        quote: {
          name: "检测双引号",
          desc: "检测英文双引号 (\") 与中文双引号（“”）配对错误"
        },
        single_quote: {
          name: "检测单引号",
          desc: "检测英文单引号 (') 与中文单引号（‘’）配对错误"
        },
        pair_punctuation: {
          name: "检测其他常见成对中文标点",
          desc: "检测（）() 「」 『』 【】 〖〗 {} ｛｝ <> 〔〕 〈〉 《》 的配对错误"
        },
        auto_complete_pair: {
          name: "中文标点成对补齐",
          desc: "输入前半中文标点时自动补齐后半标点，光标保持在中间"
        }
      },
      custom: {
        enable: {
          name: "启用自定义错别字与敏感词词典",
          desc: "开启后，在正文中标记错别字与敏感词并支持批量修正"
        }
      }
    }
  },
  novel_library: {
    feature_dir_name: "00_功能库"
  },
  command: {
    proofread: {
      fix_punctuation_errors: {
        name: "修复全部已检测标点错误",
        no_active_editor: "当前没有可编辑的 Markdown 文档",
        no_changes: "未发现可自动修复的标点错误",
        done: "已修复标点数量："
      },
      fix_proofread_dict_errors: {
        name: "修复全部错误词",
        no_active_editor: "当前没有可编辑的 Markdown 文档",
        no_changes: "未发现可自动修复的错误词",
        done: "已修复错误词数量：",
        failed: "读取纠错词典失败，请检查词典文件"
      }
    },
    annotation: {
      toggle: {
        name: "开启/关闭批注功能",
        enabled: "已开启批注功能。",
        disabled: "已关闭批注功能。"
      },
      create: {
        name: "创建批注",
        no_active_editor: "当前没有可编辑的 Markdown 文档。",
        no_selection: "请先选中需要创建批注的文本。",
        out_of_scope: "当前文档不在小说库正文范围内，无法创建批注。",
        done: "已创建批注。",
        failed: "创建批注失败，请检查控制台日志。"
      }
    },
    sticky_note: {
      toggle: {
        name: "开启/关闭便签功能",
        enabled: "已开启便签功能。",
        disabled: "已关闭便签功能。"
      },
      create: {
        name: "创建灵感便签",
        no_library: "未配置小说库，无法新增便签。",
        done: "已创建便签：",
        failed: "新增便签失败，请检查控制台日志。"
      }
    },
    chapter: {
      create: {
        name: "新建章节文件",
        no_active_markdown: "请先打开一个 Markdown 文件。",
        done: "已创建章节文件：",
        failed: "生成章节文件失败，请检查控制台日志。"
      }
    }
  },
  feature: {
    snippet: {
      candidate: {
        empty: "没有匹配片段",
        footer: "第 {current}/{total} 页（←/→ 翻页，↑/↓ 选择，Enter 确认）"
      },
      quick_insert: {
        candidate: {
          empty: "没有匹配设定"
        }
      }
    },
    guidebook: {
      tooltip: "中文小说写作助手",
      tab: {
        tooltip: "设定库"
      },
      current_library: {
        none: "未匹配小说库"
      },
      action: {
        expand_all: "全部展开",
        collapse_all: "全部折叠"
      },
      search: {
        placeholder: "搜索 分类 或 设定",
        clear: "清空搜索"
      },
      menu: {
        create_collection: "创建集合",
        create_category: "创建分类",
        create_setting: "创建设定",
        edit_setting: "编辑设定",
        rename_collection: "重命名集合",
        rename_category: "重命名分类",
        rename_setting: "重命名设定",
        delete_collection: "删除集合",
        delete_category: "删除分类",
        delete_setting: "删除设定"
      },
      dialog: {
        create_collection: {
          title: "创建集合"
        },
        rename_collection: {
          title: "重命名集合"
        },
        create_category: {
          title: "创建分类"
        },
        rename_category: {
          title: "重命名分类"
        },
        create_setting: {
          title: "创建设定"
        },
        rename_setting: {
          title: "重命名设定"
        },
        delete_collection: {
          title: "删除集合",
          message: "确定删除集合「{name}」吗？"
        },
        delete_category: {
          title: "删除分类",
          message: "确定删除分类「{name}」吗？"
        },
        delete_setting: {
          title: "删除设定",
          message: "确定删除设定「{name}」吗？"
        },
        collection_name: {
          placeholder: "输入集合名"
        },
        category_name: {
          placeholder: "输入分类名"
        },
        setting_name: {
          placeholder: "输入设定名"
        }
      },
      validation: {
        empty: "不能为空",
        invalid_name: "名称包含非法字符",
        exists: "名称已存在"
      },
      notice: {
        action_failed: "操作失败，请稍后重试",
        node_not_found: "目标不存在，请刷新后重试",
        collection_multi_source_unsupported: "存在同名集合，暂不支持在合并条目上执行此操作"
      },
      preview: {
        action: {
          locate: "定位",
          open: "打开"
        },
        alias_label: "别名",
        empty_content: "(无设定内容)"
      },
      tree: {
        loading: "加载设定目录中...",
        empty: "设定库暂无可用内容"
      }
    },
    editor_menu: {
      add_setting: "添加设定"
    },
    sticky_note: {
      title: "灵感便签",
      action: {
        sparkles: {
          tooltip: "新增便签"
        },
        pin: {
          tooltip: "置顶便签"
        },
        float: {
          tooltip: "悬浮便签"
        },
        unfloat: {
          tooltip: "取消悬浮"
        },
        menu: {
          tooltip: "更多操作"
        }
      },
      search: {
        placeholder: "搜索正文或 #标签",
        clear: "清空搜索"
      },
      sort: {
        tooltip: {
          desc: "按时间降序排序",
          asc: "按时间升序排序"
        },
        created_desc: "按创建时间降序",
        created_asc: "按创建时间升序",
        modified_desc: "按编辑时间降序",
        modified_asc: "按编辑时间升序"
      },
      list: {
        empty: "没有符合条件的便签"
      },
      content: {
        editor: {
          aria_label: "编辑便签内容"
        },
        placeholder: "点击输入便签内容"
      },
      tags: {
        editor: {
          aria_label: "编辑便签标签"
        },
        placeholder: "点击添加标签（示例：#角色 #伏笔）"
      },
      image: {
        toggle: {
          expand: "展开图片区",
          collapse: "折叠图片区"
        },
        add: {
          tooltip: "添加图片",
          duplicate: "该图片已添加"
        },
        remove: {
          tooltip: "移除图片"
        },
        pick: {
          placeholder: "搜索库内图片（按文件名或路径）",
          empty: "库内暂无可选图片文件"
        }
      },
      rich_menu: {
        bold: "加粗",
        italic: "斜体",
        unordered: "无序列表",
        ordered: "有序列表",
        highlight: "高亮",
        strikethrough: "删除线",
        clear_format: "清除格式"
      },
      menu: {
        color: "便签颜色",
        pin: "置顶便签",
        unpin: "取消置顶",
        delete: "删除便签"
      },
      notice: {
        load_failed: "便签加载失败，请检查控制台日志。",
        save_failed: "便签保存失败，请检查控制台日志。",
        delete_failed: "便签删除失败，请检查控制台日志。"
      }
    },
    timeline: {
      title: "时间轴",
      action: {
        add: "新增时间节点",
        menu: "更多操作"
      },
      search: {
        placeholder: "搜索时间、标题或内容",
        clear: "清空搜索"
      },
      filter: {
        tooltip: "筛选颜色",
        clear: "清除筛选"
      },
      list: {
        empty: "没有符合条件的时间节点"
      },
      time: {
        placeholder: "点击输入\n时间"
      },
      title_input: {
        placeholder: "点击输入标题"
      },
      content: {
        placeholder: "点击输入内容"
      },
      menu: {
        insert_before: "在上方插入时间节点",
        insert_after: "在下方插入时间节点",
        delete: "删除时间节点"
      },
      notice: {
        load_failed: "时间轴加载失败，请检查控制台日志。",
        save_failed: "时间轴保存失败，请检查控制台日志。",
        delete_failed: "时间轴删除失败，请检查控制台日志。",
        create_failed: "创建时间节点失败，请检查控制台日志。",
        reorder_failed: "时间轴排序保存失败，请检查控制台日志。",
        no_library: "未配置小说库，无法新增时间节点。"
      },
      type: {
        summary: "「主线A」",
        foreshadow: "「主线B」",
        memo: "「支线A」",
        side_story: "「支线B」",
        bookmark: "「支线C」",
        comment: "「支线D」",
        pending: "「支线E」"
      }
    },
    annotation: {
      title: "批注",
      default_title: "未命名批注",
      editor_menu: {
        create: "创建批注"
      },
      search: {
        placeholder: "搜索标题或批注内容",
        clear: "清空搜索"
      },
      filter: {
        tooltip: "筛选颜色",
        clear: "清除筛选",
        current_file: "仅当前文本"
      },
      list: {
        empty: "没有符合条件的批注"
      },
      content: {
        placeholder: "点击输入批注内容"
      },
      action: {
        locate: "定位",
        menu: "更多操作"
      },
      menu: {
        delete: "删除批注"
      },
      notice: {
        load_failed: "批注加载失败，请检查控制台日志。",
        save_failed: "批注保存失败，请检查控制台日志。",
        delete_failed: "批注删除失败，请检查控制台日志。",
        create_failed: "创建批注失败，请检查控制台日志。",
        source_missing: "源文件不存在，无法定位。"
      },
      type: {
        summary: "「概要」",
        foreshadow: "「伏笔」",
        memo: "「备忘」",
        side_story: "「支线」",
        bookmark: "「书签」",
        comment: "「评论」",
        pending: "「待定」"
      }
    },
    character_count: {
      unit: {
        char: "字",
        chapter: "章",
        ten_thousand: "万"
      }
    }
  }
};

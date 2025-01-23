> This document is still for version 0.x, please refer to the [English Version](./README.md) for the latest updates.

<h1>ModelScope Studio</h1>

<p align="center">
    <img src="https://modelscope.oss-cn-beijing.aliyuncs.com/modelscope.gif" height="60" style="vertical-align: middle;"/>
    <span style="font-size: 30px; vertical-align: middle;">
    ✖️
    </span>
    <img src="https://github.com/gradio-app/gradio/raw/main/readme_files/gradio.svg" height="60" style="vertical-align: middle;">
<p>

<p align="center">
<a href="https://github.com/modelscope/modelscope-studio">GitHub</a> | 🤖 <a href="https://modelscope.cn/studios/modelscope/modelscope-studio/summary">ModelScope Studio</a> ｜ 🤗 <a href="https://huggingface.co/spaces/modelscope/modelscope-studio">Hugging Face Space</a>
<br>
  <a href="README-zh_CN.md">中文</a>&nbsp ｜ &nbsp<a href="README.md">English</a>&nbsp ｜ &nbsp日本語
</p>

`modelscope_studio` は、gradio 4.x をベースにした拡張コンポーネントライブラリのセットで、ModelScope Studio 内の gradio アプリケーションの様々な拡張ニーズに対応するためのものになります。こちらは主に会話シナリオの強化、マルチモーダルコンテキストのサポート、その他様々な特殊シナリオの支援に重点を置いています。

## インストール

```sh
pip install modelscope_studio
```

## クイックスタート

```python
import time
import gradio as gr
import modelscope_studio.components.legacy as mgr

def submit(_input, _chatbot):
    print('text：', _input.text)
    print('files: ', _input.files)
    _chatbot.append([_input, None])
    yield _chatbot
    time.sleep(1)
    _chatbot[-1][1] = [{
        "flushing": False,
        "text": 'bot1: ' + _input.text + '!'
    }, {
        "text": 'bot2: ' + _input.text + '!'
    }]
    yield {
        chatbot: _chatbot,
    }

with gr.Blocks() as demo:
    chatbot = mgr.Chatbot(height=400)

    input = mgr.MultimodalInput()
    input.submit(fn=submit, inputs=[input, chatbot], outputs=[chatbot])

demo.queue().launch()
```

![quickstart](./resources/quickstart.png)

## コンポーネントドキュメント

現在サポートされているコンポーネントは以下の通りです:

- Chatbot: gradio チャットボット拡張コンポーネントは、マルチモーダルコンテンツ出力、マルチボットシナリオ、会話コンテンツ内のカスタムレンダリングコンポーネントやイベントインタラクションをサポートします。
- MultimodalInput: ファイルアップロード、録画、写真撮影などの機能をサポートするマルチモーダル入力ボックス。
- Markdown: gradio Markdown 拡張コンポーネントは、マルチモーダルコンテンツ（オーディオ、ビデオ、音声、ファイル、テキスト）の出力をサポートします。
- WaterfallGallery: gradio Gallery 拡張コンポーネントは、ウォーターフォール形式の画像表示をサポートします。
- その他のコンポーネント...

詳しい使い方は[ドキュメントと例](https://modelscope.cn/studios/modelscope/modelscope-studio/summary)を参照して下さい

## 開発

このリポジトリをローカルにクローンする:

```sh
git clone git@github.com:modelscope/modelscope-studio.git
cd modelscope-studio
# バックエンド用
pip install -e '.'
# フロントエンド用
npm install pnpm -g

pnpm install
pnpm build
```

デモを実行!

```sh
gradio docs/app.py
```

または、次のような単一のデモを実行:

```sh
gradio docs/components/Chatbot/demos/basic.py
```

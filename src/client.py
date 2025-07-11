# main.py | Intellifusion Version 0.2.0(2023082412000) Developer Alpha
# headers
from setup import setup
setup()

import ctypes
import ipaddress
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Literal, TypedDict
from urllib.parse import urlparse
import socketserver
from concurrent.futures import ProcessPoolExecutor
from tkinter.filedialog import askopenfilename

import jieba
import openai
import psutil
import validators
from flask import Flask, stream_with_context, json, jsonify, render_template, request
from flaskwebgui import FlaskUI
from loguru import logger
from playhouse.shortcuts import model_to_dict
from thefuzz import fuzz, process
from peewee import fn

from config import Prompt, Settings
from data import History, Models, Widgets, Sessions
from models import *

pool = ThreadPoolExecutor()

# configs
app = Flask(__name__)
app.config.from_object(__name__)
from setup import APP_DIR
DATA_DIR = APP_DIR / "data"
DICT_DIR = APP_DIR / "dicts" / "dict.txt"
LOG_FILE = DATA_DIR / "models.log"

# setup
jieba.set_dictionary(DICT_DIR)
jieba.initialize()
logger.add(LOG_FILE)
cfg = Settings()
pmt = Prompt()


# main
@app.route("/")  # 根目录
def root():
    return render_template("main.html")


@app.post("/request_models_stream")
@stream_with_context
def request_models_stream():
    InputInfo = request.form.get("userinput")
    InputModel = request.form["modelinput"]
    use_search = request.form.get("use_search", "false")
    use_detail = request.form.get("use_detail", "false")
    image_file = request.files.get("image")
    image_b64 = None
    if image_file:
        import base64
        image_b64 = base64.b64encode(image_file.read()).decode()
    model_type = Models.get(Models.id == Sessions.get(Sessions.id == InputModel).model_id).type
    if model_type == "OpenAI":
        try:
            Model_response = request_OpenAI(SessionID=InputModel, Userinput=InputInfo, stream=True)
            for r in Model_response:
                yield r
        except openai.error.AuthenticationError:
            yield "Check Your API Key"
    else:
        r = request_Json(SessionID=InputModel, Userinput=InputInfo, use_search=use_search, use_detail=use_detail, image_b64=image_b64)
        yield r


@app.post("/GetModelList")
def GetModelList():
    try:
        ModelList = Models.select()
    except:
        ModelList = {}
    ModelList_json = [model_to_dict(Model) for Model in ModelList]
    logger.info("{}", ModelList_json)
    return jsonify(ModelList_json)


@app.post("/GetActiveModels")
def GetActiveModels():
        try:
            ModelList = Sessions.select().order_by(Sessions.order)
        except:
            ModelList = {}
        ModelList_json = [model_to_dict(Model) for Model in ModelList]
        logger.info("{}", ModelList_json)
        return jsonify(ModelList_json)


@app.post("/GetModelForSession")
def GetModelForSession():
    Model = Models.select()
    seen = set()
    ModelList = []
    ModelDict = []
    for m in Model:
        key = (m.name, m.url)
        if key in seen:
            continue
        seen.add(key)
        ModelList.append(m.name)
        ModelDict.append(m.id)
    logger.info("{},{}",ModelDict,ModelList)
    return jsonify({"ModelList": ModelList,
                    "ModelDict": ModelDict})


@app.post("/AddSession")
def add_Session():
    model_id = request.form["model_id"]
    comment = request.form["comment"]
    # 判断该模型是否已有会话
    existing_sessions = Sessions.select().where(Sessions.model_id == model_id)
    session_count = existing_sessions.count()
    # 新建会话
    create_session(comment=comment, model_id=model_id)
    # 如果之前没有会话，且是本地模型，则自动run
    model = Models.get(Models.id == model_id)
    if session_count == 0 and (model.type in ["Json", "API"] or "deepseek" in model.name.lower() or "ollama" in model.name.lower()):
        # 自动run
        from urllib.parse import urlparse
        port = urlparse(model.url).port or 80
        import requests
        data = {
            "state": "run",
            "number": model_id,
            "comment": model.name,
            "type": model.type,
            "url": model.url,
            "APIkey": model.api_key,
            "LcCompiler": model.launch_compiler,
            "LcUrl": model.launch_path,
        }
        try:
            requests.post("http://127.0.0.1:5000/exchange", data=data, timeout=10)
        except Exception as e:
            pass
    return jsonify({"response": True, "message": "添加成功"})


@app.post("/EditSessionOrder")
def EditSessionOrder():
    input_id = request.form["id"]
    order = request.form["order"]
    s = Sessions.update({
        Sessions.order : order,
    }).where(Sessions.id == input_id)
    s.execute()
    return jsonify({"response": True})


@app.post("/CloseSession")
def Close_Session():
    session_id = request.form["model_id"]
    u = Sessions.get(Sessions.id ==  session_id)
    model_id = u.model_id
    # 删除对应历史
    History.delete().where(History.session_id == session_id).execute()
    u.delete_instance()
    # 判断该模型是否还有会话
    remaining = Sessions.select().where(Sessions.model_id == model_id).count()
    model = Models.get(Models.id == model_id)
    if remaining == 0 and (model.type in ["Json", "API"] or "deepseek" in model.name.lower() or "ollama" in model.name.lower()):
        # 自动stop
        from urllib.parse import urlparse
        port = urlparse(model.url).port or 80
        import requests
        data = {
            "state": "stop",
            "number": model_id,
            "comment": model.name,
            "type": model.type,
            "url": model.url,
            "APIkey": model.api_key,
            "LcCompiler": model.launch_compiler,
            "LcUrl": model.launch_path,
        }
        try:
            requests.post("http://127.0.0.1:5000/exchange", data=data, timeout=10)
        except Exception as e:
            pass
    return jsonify({"response": True, "message": "关闭成功"})


@app.post("/exchange")
def AddModel():
    InputState = request.form.get("state")
    InputID = request.form.get("number")
    InputType = request.form.get("type")
    InputComment = request.form.get("comment")
    InputUrl = request.form.get("url")
    InputAPIkey = request.form.get("APIkey")
    LaunchCompiler = request.form.get("LcCompiler")
    LaunchPath = request.form.get("LcUrl")
    try:
        port = int(urlparse(InputUrl).port)
    except:
        port = 80
    if InputState == "edit":
        try:
            logger.info("User Inputs: {}, {}, {}", InputType, InputID,InputAPIkey)
            u = Models.update({
                Models.name: InputComment,
                Models.url: InputUrl,
                Models.api_key: InputAPIkey,
                Models.launch_compiler: LaunchCompiler,
                Models.launch_path: LaunchPath,
                Models.type: InputType,
            }).where(Models.id == InputID)
            u.execute()
            return jsonify({"response": True,
                            "message":"编辑成功",})
        except:
            return jsonify({"response": False,
                            "message":"编辑失败",})
    elif InputState == "del":
        try:
            u = Models.get(Models.id == InputID)
            u.delete_instance()
            return jsonify({"response": True,
                            "message":"删除成功",})
        except:
            return jsonify({"response": False,})
    elif InputState == "run":
        if request.form.get("LcCompiler") == "/" or request.form.get("LcUrl") == "/":
            return jsonify({"response": False,
                            "message":"运行失败,原因:请输入正确的启动方式",})
        else:
            launchCMD = request.form.get("LcCompiler") + " " + request.form.get("LcUrl")
            pool.submit(subprocess.run, launchCMD)
            count = 0
            while True:
                for conn in psutil.net_connections():
                    if conn.laddr.port == port:
                        return jsonify({"response": True,
                                        "message":"运行成功",})
                count += 1
                time.sleep(1)
                if count == cfg.read("BaseConfig", "TimeOut"):
                    logger.error(
                        "Model: {} launch maybe failed,because of Time Out({}),LaunchCompilerPath: {},LaunchFile: {}",
                        InputComment,
                        cfg.read("BaseConfig", "TimeOut"),
                        LaunchCompiler,
                        LaunchPath,
                    )
                    return jsonify({"response": False,
                                    "message":"运行失败,原因:超时",})
    elif InputState == "stop":
        try:
            for conn in psutil.net_connections():
                if conn.laddr.port == port:
                    pid = conn.pid
                    p = psutil.Process(pid)
                    p.kill()
                    break
            return jsonify({"response": True,
                            "message":"停止成功",})
        except:
            return jsonify({"response": False,
                            "message":"停止失败成功",})
    elif InputState == "add":
        try:
            Models.create(
                type=InputType,
                name=InputComment,
                url=InputUrl,
                api_key=InputAPIkey,
                launch_compiler=LaunchCompiler,
                launch_path=LaunchPath,
            )
            return jsonify({"response": True,
                            "message": "添加成功"})
        except:
            return jsonify({"response": False,
                            "message": "添加失败"})


@app.post("/GetHistory")
def GetHistorys():
    session = request.form.get("id")
    history = History.select().where(History.session_id == session)
    history_json = [model_to_dict(h) for h in history]
    return jsonify(history_json)


@app.post("/GetActiveWidgets")
def GetActiveWidgets():
    ActiveWidgets = Widgets.select().order_by(Widgets.order).where(Widgets.available == "True")
    ActiveWidgets_json = [model_to_dict(Model) for Model in ActiveWidgets]
    return jsonify(ActiveWidgets_json)


@app.post("/GetWidgets")
def GetWidgets():
    ActiveWidgets = Widgets.select().order_by(Widgets.order)
    ActiveWidgets_json = [model_to_dict(Model) for Model in ActiveWidgets]
    logger.debug(ActiveWidgets_json)
    return jsonify(ActiveWidgets_json)


@app.post("/edit_widgets")
def edit_widgets():
    widgets_id = request.form.get("id")
    widgets_name = request.form.get("name")
    widgets_url = request.form.get("url")
    available = request.form.get("ava")
    if widgets_id == "-1":
        try:
            w = Widgets(
                order =  Widgets.select(fn.MAX(Widgets.order)).get().order + 1,
                widgets_name = widgets_name,
                widgets_url = widgets_url,
                available = available,
            )
            w.save()
            return jsonify({"response": True, "message": "添加成功"})
        except:
            return jsonify({"response": False, "message": "添加失败"})
    else:
        if request.form.get("operation") == "edit":
            try:
                u = Widgets.update({
                    Widgets.widgets_name: widgets_name,
                    Widgets.widgets_url: widgets_url,
                    Widgets.available: available,
                }).where(Widgets.id == widgets_id)
                u.execute()
                return jsonify({"response": True, "message": "更改成功"})
            except:
                return jsonify({"response": False, "message": "更改失败"})
        elif request.form.get("operation") == "del":
            try:
                w = Widgets.get(Widgets.id == widgets_id)
                w.delete_instance()
                return jsonify({"response": True, "message": "更改成功"})
            except:
                return jsonify({"response": False, "message": "更改失败"})


@app.post("/EditWidgetsOrder")
def EditWidgetsOrder():
    Temp = Widgets.update({
        Widgets.order : request.form.get("order")
    }).where(Widgets.id == request.form.get("id"))
    Temp.execute()
    return jsonify({"response":True,})


@app.post("/EditSetting")  # 编辑设置
def EditSetting():
    cfg.write("BaseConfig","Theme", request.form.get("Theme"))
    cfg.write("BaseConfig","Language", request.form.get("Language"))
    cfg.write("BaseConfig","Timeout", request.form.get("Timeout"))
    cfg.write("BaseConfig","ActiveExamine", request.form.get("ActiveExamine"))
    cfg.write("BaseConfig", "Develop", request.form.get("Develop"))
    cfg.write("RemoteConfig", "Host", request.form.get("Host"))
    cfg.write("RemoteConfig", "Port", request.form.get("Port"))
    return jsonify({"response": True,})


@app.post("/GetSetting")
def GetSetting():
    return jsonify({
        "response": "true",
        "Theme": cfg.read("BaseConfig","Theme"),
        "Language": cfg.read("BaseConfig","Language"),
        "ActiveExamine": cfg.read("BaseConfig","ActiveExamine"),
        "Timeout": cfg.read("BaseConfig","Timeout"),
        "Host": cfg.read("RemoteConfig","Host"),
        "Port": cfg.read("RemoteConfig","Port"),
        "Develop": cfg.read("BaseConfig","Develop"),
        "Languages": pmt.get_json_list(),
        })


@app.post("/prompts")
def Prompts():
    userinput = request.form.get("text")
    if userinput:
        prompts = pmt.read_config()
        prompt = {i["act"]:i["prompt"] for i in prompts}
        keywords = jieba.lcut_for_search(userinput)
        keywords = " ".join(keywords)
        result = process.extract(
            keywords, prompt.keys(), limit=5, scorer=fuzz.partial_token_sort_ratio
        )
        result = {t:prompt[t] for (t,_) in result}
    else:
        result = {}
    return jsonify(result)


@app.post("/GetVersion")
def GetVersion():
    version = cfg.read("package","Version")
    return jsonify({"version":version})


@app.post("/ReadFile")
def ReadFile():
    out = getfile()
    return jsonify(out)


@app.post("/ClearAllSessionsHistory")
def ClearAllSessionsHistory():
    History.delete().execute()
    Sessions.delete().execute()
    return jsonify({"response": True, "message": "所有会话和历史已清空"})


@app.post("/import_ollama_models")
def import_ollama_models():
    import requests
    import socket
    # 1. 自动检测端口
    candidate_ports = [11434, 50001, 50020]
    detected_port = None
    for port in candidate_ports:
        try:
            s = socket.create_connection(("127.0.0.1", port), timeout=1)
            s.close()
            detected_port = port
            break
        except Exception:
            continue
    if detected_port is None:
        # 进程检测法
        import psutil
        for p in psutil.process_iter(['name', 'cmdline']):
            try:
                if 'ollama' in ' '.join(p.info.get('cmdline', [])):
                    for conn in p.connections(kind='inet'):
                        if conn.status == psutil.CONN_LISTEN:
                            detected_port = conn.laddr.port
                            break
            except Exception:
                continue
            if detected_port:
                break
    if detected_port is None:
        return jsonify({"response": False, "message": "未检测到Ollama服务端口，请确保Ollama已运行。"})
    # 2. 获取模型列表
    try:
        resp = requests.get(f"http://127.0.0.1:{detected_port}/api/tags", timeout=5)
        tags = resp.json().get('models', [])
    except Exception as e:
        return jsonify({"response": False, "message": f"获取Ollama模型列表失败: {e}"})
    # 3. 批量写入Models表
    imported = 0
    for m in tags:
        name = m.get('name')
        if not name:
            continue
        # 检查是否已存在
        if Models.select().where(Models.name == name).exists():
            continue
        Models.create(
            type="Json",
            name=name,
            url=f"http://127.0.0.1:{detected_port}/",
            api_key="/",
            launch_compiler="ollama",
            launch_path=f"run {name}",
        )
        imported += 1
    return jsonify({"response": True, "message": f"成功导入{imported}个Ollama模型，端口{detected_port}"})


@app.errorhandler(404)
def error404(error):
    return render_template("404.html"), 404


#Blue Prints
from widgets import widgets_blue

app.register_blueprint(widgets_blue)


# class
class Message(TypedDict):
    role: Literal["admin"] | Literal["user"]
    content: str

# functions
def get_free_port():
    with socketserver.TCPServer(("localhost", 0), None) as s:
        free_port = s.server_address[1]
    return free_port

def getfile():
    with ProcessPoolExecutor() as p:
        r = p.submit(askopenfilename)
    str(r)
    return r.result()

if cfg.read("BaseConfig", "Develop") == "True":
    try:
        id = Widgets.get(Widgets.widgets_name == "test").id
    except:
        w = Widgets(
            order = 4,
            widgets_name = "test",
            widgets_url = "/widgets/test",
            available = "true",
        )
        w.save()
    
    @app.route("/test")
    def getfile_test():
        out = getfile()
        logger.debug("{}", out)
        return render_template("./test.html")
    
    @app.route("/offline")
    def offline():
        return render_template("offline.html")

# launch
if __name__ == "__main__":
    logger.info("Application(v0.2.0 ∂) Launched!")
    pmt.get_json()
    if cfg.read("RemoteConfig", "Port") == "0":
        port=get_free_port()
    else:
        port=cfg.read("RemoteConfig", "Port")
    if cfg.read("BaseConfig", "Develop") == "True":
        logger.level("DEBUG")
        logger.debug("running in debug mode")
        app.run(
            debug=cfg.read("BaseConfig", "Develop"),
            port=port,
            host=cfg.read("RemoteConfig", "Host"),
        )
    elif cfg.read("BaseConfig", "Develop") == "False" or cfg.read("BaseConfig", "Develop") == False:
        logger.debug("run in GUI mode")
        print(cfg.read("BaseConfig", "Develop"))
        try:
            ctypes.windll.user32.ShowWindow(
                ctypes.windll.kernel32.GetConsoleWindow(), 0
            )
        except:
            pass
        FlaskUI(
            app=app,
            server="flask",
            port=port,
            width=1800,
            height=1000,
        ).run()

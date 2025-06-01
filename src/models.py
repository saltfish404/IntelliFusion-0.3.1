from data import Models, Sessions, History
from peewee import fn
import openai
from typing import Literal, TypedDict
import mistune
import requests
import json


class Message(TypedDict):
    role: Literal["admin"] | Literal["user"]
    content: str


def create_session(comment: str, model_id: int):
    '''
    comment是输入时的备注 用于给会话命名
    model_id是输入会话所使用的模型在数据库中的ID
    '''
    if comment is None or model_id is None:
        raise ValueError
    try:
        # 自动分配 order 字段
        max_order = Sessions.select(fn.MAX(Sessions.order)).scalar() or 0
        # 创建会话，model_id 存为字符串
        session = Sessions.create(
            comment=comment,
            model_id=str(model_id),
            model_type=Models.get(Models.id == model_id).type,
            model_url=Models.get(Models.id == model_id).url,
            order=max_order + 1,
            )
        return session.id
    except BaseException:
        try:
            # Sessions数据库出现错误
            Models.get(Models.id == model_id).type
            raise Sessions.DoesNotExist
        except BaseException:
            # Models数据库出现错误
            raise Models.DoesNotExist


def request_OpenAI(SessionID: int, Userinput: str, stream: bool = True):
    '''
    SessionID 会话在数据库中的ID
    Userinput 用户输入的内容
    stream    是否需要流式传输
    '''
    if SessionID is None or Userinput is None:
        raise ValueError
    response = ""
    try:
        Model_ID = Models.get(
            Models.id == Sessions.get(
                Sessions.id == SessionID).model_id)
    except BaseException:
        raise Models.get.error
    openai.api_base = (Model_ID.url)
    messages = []
    for r in History.select().where(History.session_id == SessionID):
        r: History
        assert isinstance(r.UserInput, str)
        assert isinstance(r.response, str)
        question: Message = {"role": "user", "content": r.UserInput}
        response_model: Message = {"role": "assistant", "content": r.response}
        messages.append(question)
        messages.append(response_model)
    question: Message = {"role": "user", "content": Userinput}
    messages.append(question)
    openai.api_key = (
        Model_ID.api_key
    )
    for chunk in openai.ChatCompletion.create(
        model=Model_ID.name,
        messages=messages,
        stream=True,
        temperature=0,
    ):
        if stream:
            if hasattr(chunk.choices[0].delta, "content"):
                print(chunk.choices[0].delta.content, end="", flush=True)
                response = response + chunk.choices[0].delta.content
                response_out = mistune.html(response)
                yield response_out
        else:
            if hasattr(chunk.choices[0].delta, "content"):
                print(chunk.choices[0].delta.content, end="", flush=True)
                response = response + chunk.choices[0].delta.content
                response = mistune.html(response)
            return response
    History.create(
        session_id=SessionID,
        UserInput=Userinput,
        response=response_out,
    )


def search_serpapi(query, api_key, num_results=3):
    import requests
    params = {
        "q": query,
        "api_key": api_key,
        "engine": "google",
        "hl": "zh-cn",
        "gl": "cn"
    }
    try:
        response = requests.get(
            "https://serpapi.com/search",
            params=params,
            timeout=3)
        data = response.json()
    except Exception:
        return ""
    results = []
    for result in data.get("organic_results", [])[:num_results]:
        title = result.get("title", "")
        snippet = result.get("snippet", "")
        link = result.get("link", "")
        results.append(f"{title}\n{snippet}\n{link}")
    return "\n\n".join(results)


def request_Json(
        SessionID: int,
        Userinput: str,
        use_search: str = "false",
        use_detail: str = "false",
        image_b64: str = None):
    if SessionID is None or Userinput is None:
        raise ValueError
    try:
        model_id = Sessions.get(Sessions.id == SessionID).model_id
        model = Models.get(Models.id == model_id)
    except BaseException:
        raise ValueError("SessionID Error")
    # 联网增强：用 SerpAPI 搜索
    if use_search == "true":
        # 用户实际 SerpAPI Key
        serpapi_key = "177bae5df0019e2bdf889abba29ffc23f8c3d4259b8c9f030155ef60b0e2c093"
        num_results = 10 if use_detail == "true" else 3
        search_results = search_serpapi(Userinput, serpapi_key, num_results=num_results)
        base_prompt = f"以下是最新网络搜索结果：\n{search_results}\n\n请结合以上信息回答：{Userinput}"
    else:
        base_prompt = Userinput
    # 详细解题 or 简洁口语
    if use_detail == "true":
        prompt = f"请详细分步推理并用 LaTeX 公式展示计算过程，最后给出答案。用户问题：{base_prompt}"
    else:
        prompt = f"请用简洁自然的口语直接回答用户问题，不要分步推理，不要使用公式。用户问题：{base_prompt}"
    def is_local_ollama(m):
        from urllib.parse import urlparse
        u = urlparse(m.url)
        return (
            m.type.lower() == "json" and
            (u.hostname == "127.0.0.1" or u.hostname == "localhost") and
            (u.port in [11434, 50001, 50020])
        )
    if is_local_ollama(model):
        if image_b64:
            payload = {
                "model": model.name,
                "messages": [
                    {"role": "user", "content": prompt, "images": [image_b64]}
                ]
            }
        else:
            payload = {
                "model": model.name,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        response = requests.post(
            url=model.url,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
            stream=True
        )
        contents = []
        try:
            for line in response.iter_lines():
                if line:
                    data = json.loads(line.decode('utf-8'))
                    if "message" in data and "content" in data["message"]:
                        contents.append(data["message"]["content"])
                    elif "response" in data:
                        contents.append(data["response"])
            content = "".join(contents)
            response_out = mistune.html(content)
        except Exception as e:
            response_out = f"解析Ollama响应失败: {e}"
    else:
        pass
    History.create(
        session_id=SessionID,
        UserInput=Userinput,
        response=response_out,
    )
    return response_out

from widgets import widgets_blue
import psutil
from flask import render_template, jsonify, send_from_directory, request
import requests
import json
import os
import time
import re
import threading
from functools import lru_cache
from widgets.city_name_to_id import city_map
import ipaddress

# QWeather API configuration
QWEATHER_API_KEY = os.getenv("QWEATHER_API_KEY", "YOUR_API_KEY_HERE")
QWEATHER_API_BASE = "https://devapi.qweather.com/v7"

# 聚合数据API KEY
JUHE_CALENDAR_KEY = os.getenv("JUHE_CALENDAR_KEY", "YOUR_API_KEY_HERE")  # 万年历
JUHE_STAR_KEY = os.getenv("JUHE_STAR_KEY", "YOUR_API_KEY_HERE")    # 星座运势
JUHE_LAOHUANG_LI_KEY = os.getenv("JUHE_LAOHUANG_LI_KEY", "YOUR_API_KEY_HERE")  # 老黄历

# //////////// Put Your Wigets Here //////////////////



# //////////// Put Your Wigets Here //////////////////

# 简单缓存（每个日期/星座每天只请求一次）
calendar_cache = {}
star_cache = {}
cache_lock = threading.Lock()

@widgets_blue.route("/test")
def test_widgets():
    return render_template("test.html")

@widgets_blue.route("/Translate_Direct")
def TranslateTranslate():
    return render_template("Translate_Direct.html")

@widgets_blue.route('/CPU_Percent')
def CorePercent():
    return render_template("CPU_Percent.html")

@widgets_blue.route('/RAM_Percent')
def RAMPercent():
    return render_template("Memory_Percent.html") 

@widgets_blue.route('/GPU_Percent')
def GPURAMPercent():
    return render_template("GPU_Percent.html") 

@widgets_blue.post('/Get_CPU_Percent')
def Get_CPU_Precent():
    import psutil
    # 先调用一次丢弃
    psutil.cpu_percent(interval=None)
    # 再调用一次，阻塞1秒，返回真实值
    cpu_percent = psutil.cpu_percent(interval=1)
    return jsonify({'data': cpu_percent})

@widgets_blue.post('/Get_RAM_Percent')
def Get_RAM_Precent():
    memory_percent = psutil.virtual_memory().percent
    return jsonify({'data':memory_percent})

@widgets_blue.post('/Get_GPU_Percent')
def Get_GPU_RAM_Precent():
    try:
        import pynvml
        pynvml.nvmlInit()
        handler = pynvml.nvmlDeviceGetHandleByIndex(0)
        util = pynvml.nvmlDeviceGetUtilizationRates(handler)
        gpu_util = util.gpu  # 核心利用率
        pynvml.nvmlShutdown()  # 用完及时释放
        return jsonify({'data': gpu_util})
    except Exception as e:
        print(f"GPU Utilization Error: {e}")
        return jsonify({'data': 0})

@widgets_blue.route("/weather")
def weather_widget():
    return render_template("weather.html")

# 获取客户端IP
def get_client_ip():
    if 'X-Forwarded-For' in request.headers:
        ip = request.headers['X-Forwarded-For'].split(',')[0]
    else:
        ip = request.remote_addr
    return ip

def is_private_ip(ip):
    try:
        return ipaddress.ip_address(ip).is_private
    except:
        return False

def get_city_by_ip(ip):
    try:
        # 检查是否是私有IP
        if is_private_ip(ip):
            return None  # 返回None表示需要手动选择
        
        # 检查是否使用了代理/VPN
        resp = requests.get(f"http://ip-api.com/json/{ip}?lang=zh-CN", timeout=3)
        data = resp.json()
        
        # 检查是否使用了代理/VPN
        is_proxy = data.get("proxy", False) or data.get("hosting", False)
        country = data.get("country", "")
        city = data.get("city", "")
        
        # 如果检测到代理/VPN或非中国IP，返回None
        if is_proxy or country != "中国":
            print(f"检测到代理/VPN或非中国IP: {ip}, 国家: {country}, 城市: {city}")
            return None
            
        # 确保城市名与和风天气城市表匹配
        if city and city in city_map:
            return city
        return None
    except Exception as e:
        print("IP定位失败：", e)
        return None

@widgets_blue.route("/weather/now")
def get_weather_now():
    ip = get_client_ip()
    city = get_city_by_ip(ip)
    city_id = city_map.get(city, "101280701")  # 默认珠海
    url = f"{QWEATHER_API_BASE}/weather/now?location={city_id}&key={QWEATHER_API_KEY}"
    air_url = f"{QWEATHER_API_BASE}/air/now?location={city_id}&key={QWEATHER_API_KEY}"
    uv_url = f"{QWEATHER_API_BASE}/indices/1d?type=5&location={city_id}&key={QWEATHER_API_KEY}"
    try:
        # 添加超时设置和错误处理
        response = requests.get(url, timeout=5)
        response.raise_for_status()  # 检查HTTP错误
        data = response.json()
        air_quality = None
        uv_index = None
        # 获取空气质量
        try:
            air_response = requests.get(air_url, timeout=5)
            air_response.raise_for_status()
            air_data = air_response.json()
            if air_data["code"] == "200":
                air_quality = air_data["now"]
        except Exception as e:
            print(f"Error fetching air quality data: {e}")
            air_quality = None
        # 获取紫外线指数
        try:
            uv_response = requests.get(uv_url, timeout=5)
            uv_response.raise_for_status()
            uv_data = uv_response.json()
            if uv_data["code"] == "200" and uv_data["daily"]:
                uv_index = uv_data["daily"][0]
        except Exception as e:
            print(f"Error fetching UV index data: {e}")
            uv_index = None
        if data["code"] == "200":
            weather_data = data["now"]
            result = dict(weather_data)
            result["air"] = air_quality
            result["uv"] = uv_index
            result["city"] = city or "珠海市"  # 如果city为None，显示默认城市
            result["city_id"] = city_id
            result["need_location"] = city is None  # 添加标记，表示是否需要手动选择城市
            return jsonify(result)
        else:
            print(f"Weather API error: {data.get('code')} - {data.get('message', 'Unknown error')}")
            return jsonify({"error": f"Weather API error: {data.get('code')}"}), 500
    except requests.exceptions.Timeout:
        print("Weather API request timed out")
        return jsonify({"error": "Weather API request timed out"}), 504
    except requests.exceptions.RequestException as e:
        print(f"Error fetching weather data: {e}")
        return jsonify({"error": f"Failed to fetch weather data: {str(e)}"}), 500
    except Exception as e:
        print(f"Unexpected error in weather endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

@widgets_blue.route("/weather/forecast")
def get_weather_forecast():
    city_id = "101280701"
    url = f"{QWEATHER_API_BASE}/weather/3d?location={city_id}&key={QWEATHER_API_KEY}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data["code"] == "200":
            return jsonify(data["daily"])
        else:
            print(f"Forecast API error: {data.get('code')} - {data.get('message', 'Unknown error')}")
            return jsonify({"error": f"Forecast API error: {data.get('code')}"}), 500
    except requests.exceptions.Timeout:
        print("Forecast API request timed out")
        return jsonify({"error": "Forecast API request timed out"}), 504
    except requests.exceptions.RequestException as e:
        print(f"Error fetching forecast data: {e}")
        return jsonify({"error": f"Failed to fetch forecast data: {str(e)}"}), 500
    except Exception as e:
        print(f"Unexpected error in forecast endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

@widgets_blue.route('/weather.html')
def weather_html():
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    return send_from_directory(templates_dir, 'weather.html')

@widgets_blue.post('/Get_Net_Traffic')
def get_net_traffic():
    import re
    counters = psutil.net_io_counters(pernic=True)
    wifi_keys = [k for k in counters if re.search(r'(wi-?fi|wlan|wireless)', k, re.I)]
    if wifi_keys:
        nic = wifi_keys[0]
    else:
        nic = max(counters, key=lambda k: counters[k].bytes_recv + counters[k].bytes_sent)
    sent = counters[nic].bytes_sent
    recv = counters[nic].bytes_recv
    return jsonify({
        "sent": sent,
        "recv": recv
    })

@widgets_blue.route('/Net_Traffic')
def NetTraffic():
    return render_template("Net_Traffic.html")

@widgets_blue.route('/Net_Traffic.html')
def NetTrafficHtml():
    return render_template("Net_Traffic.html")

@widgets_blue.route('/Performance_Square')
def PerformanceSquare():
    return render_template("Performance_Square.html")

@widgets_blue.route('/Calendar_Star')
def CalendarStar():
    return render_template("Calendar_Star.html")

@widgets_blue.route('/Calendar_Star.html')
def CalendarStarHtml():
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    return send_from_directory(templates_dir, 'Calendar_Star.html')

@widgets_blue.route('/api/calendar/<date>')
def api_calendar(date):
    # date: yyyy-mm-dd
    with cache_lock:
        cache = calendar_cache.get(date)
        if cache and time.time() - cache['ts'] < 23*3600:
            return jsonify(cache['data'])
    url_calendar = f"http://v.juhe.cn/calendar/day?date={date}&key={JUHE_CALENDAR_KEY}"
    url_lhl = f"http://v.juhe.cn/laohuangli/d?date={date}&key={JUHE_LAOHUANG_LI_KEY}"
    try:
        # 先查万年历API主信息
        resp = requests.get(url_calendar, timeout=5)
        data = resp.json()
        if data.get('error_code', 1) == 10012:
            return jsonify({'error': 'API配额已用尽，请更换key或明日再试'}), 200
        if data.get('error_code', 1) == 0:
            result = data['result']['data']
            # 再查老黄历API补充宜忌（只用suit/avoid）
            try:
                resp2 = requests.get(url_lhl, timeout=5)
                data2 = resp2.json()
                if data2.get('error_code', 1) == 0:
                    lhl = data2['result']
                    result['suit'] = lhl.get('suit') or lhl.get('yi') or ''
                    result['avoid'] = lhl.get('avoid') or lhl.get('ji') or ''
                else:
                    print(f"LHL API error: {data2.get('error_code')} - {data2.get('reason','Unknown error')}")
            except Exception as e:
                print(f"Exception in LHL API: {e}")
            with cache_lock:
                calendar_cache[date] = {'data': result, 'ts': time.time()}
            return jsonify(result)
        else:
            print(f"Calendar API error: {data.get('error_code')} - {data.get('reason','Unknown error')}")
            return jsonify({'error': data.get('reason', 'API error')}), 502
    except Exception as e:
        print(f"Exception in calendar API: {e}")
        return jsonify({'error': f'Exception: {str(e)}'}), 502

@widgets_blue.route('/api/star/<star>/<date>')
def api_star(star, date):
    # star: 星座名（拼音），date: today
    key = f"{star}_{date}"
    with cache_lock:
        cache = star_cache.get(key)
        if cache and time.time() - cache['ts'] < 23*3600:
            return jsonify(cache['data'])
    url = f"http://web.juhe.cn:8080/constellation/getAll?consName={star}&type=today&key={JUHE_STAR_KEY}"
    try:
        resp = requests.get(url, timeout=5)
        data = resp.json()
        if data['error_code'] == 0:
            with cache_lock:
                star_cache[key] = {'data': data, 'ts': time.time()}
            return jsonify(data)
        else:
            return jsonify({'error': data.get('reason', 'API error')}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@widgets_blue.route('/api/calendar/month/<year_month>')
def api_calendar_month(year_month):
    url = f"http://v.juhe.cn/calendar/month?year-month={year_month}&key={JUHE_CALENDAR_KEY}"
    try:
        resp = requests.get(url, timeout=5)
        data = resp.json()
        if data.get('error_code', 1) == 10012:
            return jsonify({'error': 'API配额已用尽，请更换key或明日再试'}), 200
        if data.get('error_code', 1) == 0:
            return jsonify(data['result'])
        else:
            return jsonify({'error': data.get('reason', 'API error')}), 502
    except Exception as e:
        return jsonify({'error': f'Exception: {str(e)}'}), 502

@widgets_blue.route('/api/calendar/year/<year>')
def api_calendar_year(year):
    url = f"http://v.juhe.cn/calendar/year?year={year}&key={JUHE_CALENDAR_KEY}"
    try:
        resp = requests.get(url, timeout=5)
        data = resp.json()
        if data.get('error_code', 1) == 10012:
            return jsonify({'error': 'API配额已用尽，请更换key或明日再试'}), 200
        if data.get('error_code', 1) == 0:
            return jsonify(data['result'])
        else:
            return jsonify({'error': data.get('reason', 'API error')}), 502
    except Exception as e:
        return jsonify({'error': f'Exception: {str(e)}'}), 502

@widgets_blue.route("/weather/search")
def search_city():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([])
    
    # 从city_map中搜索匹配的城市
    results = []
    for city_name in city_map.keys():
        if query in city_name:
            results.append({
                'name': city_name,
                'id': city_map[city_name]
            })
    
    return jsonify(results[:10])  # 最多返回10个结果

import requests
from lxml import etree
from bs4 import BeautifulSoup
from fontTools.ttLib import TTFont
import re
import json
import datetime

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
}
woffDir = './font.woff'


def getdetails(url):
    book_urls = []
    response = requests.get(url)
    response.encoding = 'utf-8'
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    target = soup.find_all("a", attrs={"class": "red-btn"})
    for item in target:
        book_url = "https:" + item.get("href")
        book_urls.append(book_url)
    getEveryBookInfo(book_urls)


def getEveryBookInfo(book_urls):
    # for url in book_urls:
    #     text = getHtml(url)
    #     html = fontProc(text)
    text = getHtml("https://book.qidian.com/info/1018027842")
    html = fontProc(text)
    html = etree.HTML(html)
    html = etree.tostring(html)
    html = etree.fromstring(html)
    book_info = html.xpath('//div[@class="book-info "]//p//em//span//text()')
    tags = html.xpath('//p[@class="tag-wrap"]//a//text()')
    work_states = html.xpath('//ul[@class="work-state cf"]//li//em//text()')
    week_ticks = html.xpath('//i[@id="recCount"]//text()')
    recInfo = html.xpath('//div[@class="ticket rec-ticket hidden"]//p[3]//text()')
    recInfo = [i.strip().replace('\r', ' ') for i in recInfo]
    recRank = recInfo[0]
    recOut = ''.join(recInfo[-3:])
    rewNum = '本周打赏' + ''.join(html.xpath('//i[@class="rewardNum"]//text()'))
    todayRew = ''.join(html.xpath('//div[@class="ticket"]//p[3]//text()'))

    print(rewNum)

    # print(recStr)
    # html = etree.fromstring(html)
    # with open("./text", "w", encoding='utf-8') as f:
    #     f.write(html)
    # response = requests.get(book_url)
    # response.encoding = 'utf-8'
    # html = response.text
    # soup = BeautifulSoup(html, 'html.parser')
    return 0


def getHtml(url):
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return None
    woff = re.search("format\('eot'\); src: url\('(.+?)'\) format\('woff'\)", response.text, re.S)
    fontfile = requests.get(woff.group(1), headers=headers)
    if fontfile.status_code != 200:
        return None
    f = open(woffDir, 'wb')
    f.write(fontfile.content)
    f.close()
    response.encoding = response.apparent_encoding
    return response.text


def fontProc(text):
    font = TTFont(woffDir)
    camp = {'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8,
            'nine': 9}
    cp = {}
    for k, v in font.getBestCmap().items():
        try:  # 过滤无用的映射
            cp['&#' + str(k) + ';'] = camp[str(v)]
        except KeyError as e:
            pass
    for key in cp.keys():
        text = re.sub(key, str(cp[key]), text)
    return text


def getBook(html):
    html = etree.HTML(html)
    html = etree.tostring(html)
    html = etree.fromstring(html)
    name = html.xpath('//li//div[@class="book-mid-info"]//h4//a//text()')
    rank = html.xpath('//li//div[@class="book-img-box"]//span//text()')
    author = html.xpath('//li//div[@class="book-mid-info"]//p[@class="author"]//a[@class="name"]//text()')
    types = html.xpath('//li//div[@class="book-mid-info"]//p[@class="author"]//a[@data-eid="qd_C42"]//text()')
    status = html.xpath('//li//div[@class="book-mid-info"]//p[@class="author"]//span//text()')
    intro = html.xpath('//li//div[@class="book-mid-info"]//p[@class="intro"]//text()')
    intro = [i.strip().replace('\u2022', ' ').replace('\u2003', ' ') for i in intro]
    update = html.xpath('//li//div[@class="book-mid-info"]//p[@class="update"]//a[@data-eid="qd_C43"]//text()')
    update = [i.strip().replace('\xa0', ' ') for i in update]
    date = html.xpath('//li//div[@class="book-mid-info"]//p[@class="update"]//span//text()')
    tickets = html.xpath('//li//div[@class="book-right-info"]//div[@class="total"]//p//span//span//text()')
    book = zip(rank, name, author, types, status, intro, update, date, tickets)
    return book


def num_to_ch(num):
    """
    功能说明：将阿拉伯数字 ===> 转换成中文数字（适用于[0, 10000)之间的阿拉伯数字 ）
    """
    num = int(num)
    _MAPPING = (u'零', u'一', u'二', u'三', u'四', u'五', u'六', u'七', u'八', u'九',)
    _P0 = (u'', u'十', u'百', u'千',)
    _S4 = 10 ** 4
    if num < 0 or num >= _S4:
        return None
    if num < 10:
        return _MAPPING[num]
    else:
        lst = []
        while num >= 10:
            lst.append(num % 10)
            num = num // 10
        lst.append(num)
        c = len(lst)  # 位数
        result = u''
        for idx, val in enumerate(lst):
            if val != 0:
                result += _P0[idx] + _MAPPING[val]
            if idx < c - 1 and lst[idx + 1] == 0:
                result += u'零'
        result = result[::-1]
        if result[:2] == u"一十":
            result = result[1:]
        if result[-1:] == u"零":
            result = result[:-1]
        return result


def saveInfo(url):
    html = getHtml(url)
    getdetails(url)
    html = fontProc(html)
    book = getBook(html)
    tmp_list = []
    for rank, name, author, types, status, intro, update, date, tickets in book:
        # 注意，每次添加到列表中是要新创建字典的，不然字典定义放在外面，地址不会变每次都被覆盖了
        tmp_dict = {}
        tmp_dict['rank'] = rank
        tmp_dict['name'] = name
        tmp_dict['author'] = author
        tmp_dict['types'] = types
        tmp_dict['status'] = status
        tmp_dict['intro'] = intro
        tmp_dict['update'] = update
        tmp_dict['date'] = date
        tmp_dict['tickets'] = tickets
        tmp_list.append(tmp_dict)
    return tmp_list



def main():
    data_list = []
    today = datetime.date.today()
    novelsDir = "./" + "novels-" + str(today) + ".json"

    for page in range(1, 5 + 1):
        url = 'https://www.qidian.com/rank/yuepiao?page=%d' % page
        tmp = saveInfo(url)
        data_list += tmp
    with open(novelsDir, 'a+', encoding='utf-8') as f:
        json.dump(data_list, f, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    main()

const axios = require("request-promise");
const cloud = require("wx-server-sdk");
const cheerio = require("cheerio");
// const doubanbook = require("doubanbook");
const router = require("tcb-router");

const host = "https://book.douban.com";

// 云函数初始化
cloud.init();

// 获取详情数据
async function getDoubanDetails(bookId) {
  if (!bookId) return;
  const options = {
    url: `${host}/subject/${bookId}/?icn=index-latestbook-subject`,
    transform: body => cheerio.load(body)
  };
  const $ = await axios(options);
  let data = Object.create(null);
  try {
    data.title = $("#mainpic")
      .find("img")
      .attr("title");
    data.image = $("#mainpic")
      .find("img")
      .attr("src");
    data.rate = $(".rating_num ").text();
    data.context = $(".intro p").text();
  } catch (error) {}
  return data;
}

// 获取豆瓣列表
async function getDoubanList(size) {
  const options = {
    url: `${host}`,
    transform: body => cheerio.load(body)
  };
  const $ = await axios(options);
  const bookList = [];
  $(".slide-list .list-col")
    .eq(size)
    .find("li")
    .each(function() {
      const id = $(this)
        .find(".cover a")
        .attr("href")
        .replace(/[^0-9]/gi, "");
      const image = $(this)
        .find("img")
        .attr("src");
      const title = $(this)
        .find("img")
        .attr("alt");
      const subTitle = $(this)
        .find(".info .author")
        .text();
      bookList.push({
        id,
        image,
        subTitle,
        title
      });
    });
  return bookList;
}

exports.main = async (event, context) => {
  const app = new router({ event });

  app.router("details", async (ctx, next) => {
    const iisbon = ctx.isbon || "9787010009148";
    ctx.data.data = await getDoubanBook(iisbon);
    ctx.body = {
      code: 0,
      data: ctx.data
    };
  });

  app.router("booklist", async (ctx, next) => {
    const size = ctx.size || 1;
    ctx.data = await getDoubanList(size);
    ctx.body = {
      code: 0,
      data: ctx.data
    };
    next();
  });
  return app.serve();
};

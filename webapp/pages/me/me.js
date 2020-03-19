// miniprogram/pages/me/me.js

// 扫码 获取isbn号  根据这个号，去豆瓣写爬虫，查询具体信息 入口
const db = wx.cloud.database();
Page({
  data: {
    title: "kaiekba",
    userInfo: wx.getStorageSync("userinfo") || {}
  },
  scanCode() {
    const isbn = "9787536692930";
    wx.cloud.callFunction({
      name: "douban11",
      data: { isbn },
      success: ({ result }) => {
        result.isbn = isbn;
        result.userInfo = this.userInfo;

        db.collection("books11").add({
          data: result,
          success(add) {
            if (add._id) {
              wx.hideLoading();
              wx.showModal({
                title: "添加成功",
                content: `图书《${result.title}》添加成功`
              });
            }
          }
        });
      }
    });
  },
  onGotUserInfo(e) {
    let userInfo = e.detail.userInfo;
    // console.log(e)
    wx.cloud.callFunction({
      name: "login11",
      success: e => {
        // console.log(e.result.openid)
        userInfo.openid = e.result.openid;
        wx.setStorageSync("userinfo", userInfo);
        this.setData({
          userInfo
        });
      }
    });
  }
});

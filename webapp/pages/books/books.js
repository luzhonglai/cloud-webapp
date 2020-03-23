// miniprogram/pages/books/books.js
const db = wx.cloud.database();
Page({
  data: {
    userInfo: wx.getStorageSync("userinfo") || {},
    books: [],
    page: 0
  },
  getList() {
    let isInit = this.data.page === 0;
    wx.showLoading({
      title: "加载中"
    });
    wx.showNavigationBarLoading();
    wx.cloud
      .callFunction({
        // 要调用的云函数名称
        name: "function",
        // 传递给云函数的参数
        data: {
          $url: "booklist" // 要调用的路由的路径，传入准确路径或者通配符*
        }
      })
      .then(res => {
        
        this.setData({
          booklist: res.result.data
        });
      });
    const PAGER = 4; // 每页显示4个

    // 1 2 3 4 5 6 7 8 9 10
    // 第一页 1 2 3 4
    // 第二页 5678
    // 第三页 90
    const offset = this.data.page * PAGER;
    let ret = db.collection("books11").orderBy("create_time", "desc");
    if (offset > 0) {
      // 不是第一页
      ret = ret.skip(offset);
    }
    ret = ret
      .limit(PAGER)
      .get()
      .then(books => {
        if (isInit) {
          this.setData({
            books: books.data
          });
        } else {
          this.setData({
            books: this.data.books.concat(books.data)
          });
        }
      });
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.hideLoading();
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 下拉刷新
    this.setData(
      {
        page: 0
      },
      () => {
        this.getList();
      }
    );
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("到底了");
    this.setData(
      {
        page: this.data.page + 1
      },
      () => {
        this.getList();
      }
    );
    // 触底加载更多 分页靠这个api 无线滚动
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 分享
  }
});

//app.js
App({
  onLaunch: function() {
    wx.cloud.init({
      traceUser: true,
      env: "damowang-071688"
    });
  }
});

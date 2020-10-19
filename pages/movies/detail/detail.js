const utils = require('../../../utils/utils');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const movieId = options.id;
    const url = `${app.globalData.doubanBase}/v2/movie/subject/${movieId}`;
    utils.http(url, this.processDoubanData)
  },

  processDoubanData: function (data) {
    if (data) {
      const director = {
        avatar: "",
        name: "",
        id: ""
      };
      if (data.directors && data.directors.length > 0) {
        const {
          avatars,
          name,
          id
        } = data.directors[0];
        director.avatar = avatars.large || '';
        director.name = name;
        director.id = id;
      }
      const movie = {
        movieImg: data.images ? data.images.large : '',
        country: data.countries[0],
        title: data.title,
        originalTitle: data.original_title,
        wishCount: data.wish_count,
        commentCount: data.comments_count,
        year: data.year,
        generes: data.genres.join("、"),
        stars: utils.convertToStarsArray(data.rating.stars),
        score: data.rating.average,
        director,
        casts: utils.covertToCastString(data.casts),
        castsInfo: utils.covertToCastInfos(data.casts),
        summary: data.summary
      }
      this.setData({
        movie
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  viewMoviePostImg: function (event) {
    const {
      src
    } = event.currentTarget.dataset;
    wx.previewImage({
      current: src,
      urls: [src],
    })
  },

})
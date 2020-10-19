const utils = require('../../../utils/utils');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    navigateTitle: '',
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      category
    } = options;
    const urls = {
      "正在热映": `${app.globalData.doubanBase}/v2/movie/in_theaters`,
      "即将上映": `${app.globalData.doubanBase}/v2/movie/coming_soon`,
      "豆瓣Top250": `${app.globalData.doubanBase}/v2/movie/top250`,
    }
    utils.http(urls[category], this.processDoubanData)

    this.setData({
      navigateTitle: category,
      requestUrl: urls[category]
    })
  },

  processDoubanData: function (moviesDouban) {
    const movies = [];
    for (let idx in moviesDouban.subjects) {
      const subject = moviesDouban.subjects[idx];
      movies.push({
        title: utils.formatMovieTitle(subject.title),
        stars: utils.convertToStarsArray(subject.rating.stars),
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      })
    }
    let totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies,
      totalCount: this.data.totalCount += 20
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
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
    const refreshUrl = `${this.data.requestUrl}?start=0&count=20`;
    this.setData({
      movies: {},
      isEmpty: true
    })
    utils.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const nextUrl = `${this.data.requestUrl}?start=${this.data.totalCount}&count=20`;
    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onMovieTap: function (event) {
    const movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: `../detail/detail?id=${movieId}`,
    })
  }
})
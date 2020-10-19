const utils = require('../../utils/utils');

const app = getApp();

Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {
      movies: []
    },
    containerShow: true,
    searchPanelShow: false
  },
  onLoad: function (event) {
    const inTheatersUrl = `${app.globalData.doubanBase}/v2/movie/in_theaters?count=3&start=0`
    const comingSoonUrl = `${app.globalData.doubanBase}/v2/movie/coming_soon?count=3&start=0`
    const top250Url = `${app.globalData.doubanBase}/v2/movie/top250?count=3&start=0`
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  getMovieListData: function (url, key, categoryTitle) {
    const self = this;
    wx.request({
      url,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res) {
          self.processDoubanData(res.data, key, categoryTitle)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  processDoubanData: function (moviesDouban, key, categoryTitle) {
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
    const result = {};
    result[key] = {
      categoryTitle,
      movies
    };
    this.setData(result)
  },

  onMoreTap: function (event) {
    wx.navigateTo({
      url: `more/more?category=${event.currentTarget.dataset.category}`,
    })
  },

  onBindChange: function (e) {
    const searchUrl = `${app.globalData.doubanBase}/v2/movie/search?q=${e.detail.value}`;
    this.getMovieListData(searchUrl, "searchResult", "")
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
    })
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onMovieTap: function (event) {
    const movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: `detail/detail?id=${movieId}`,
    })
  },
})
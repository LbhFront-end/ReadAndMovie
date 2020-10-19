const {
  posts
} = require('../../../data/posts.js');

const app = getApp();
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (option) {
    const {
      gIsPlayingMusic,
      gCurrentMusicPostId
    } = app.globalData;
    const postId = option.id
    const postsCollected = wx.getStorageSync('postsCollected') || {};
    const collected = !!postsCollected[postId];
    postsCollected[postId] = collected;
    wx.setStorageSync('postsCollected', postsCollected)
    this.setData({
      ...posts[postId],
      currentPostId: postId,
      collected,
      isPlayingMusic: gCurrentMusicPostId === postId && gIsPlayingMusic
    })

    this.setAudioMonitor(postId);
  },

  setAudioMonitor: function (postId) {
    const self = this;
    wx.onBackgroundAudioPause(() => {
      self.setData({
        isPlayingMusic: false
      })
      app.globalData.gIsPlayingMusic = false;
    })
    wx.onBackgroundAudioPlay(() => {
      if (app.globalData.gCurrentMusicPostId == null) {
        app.globalData.gCurrentMusicPostId = postId;
      } else if (app.globalData.gCurrentMusicPostId === postId) {
        self.setData({
          isPlayingMusic: true
        })
      }
      app.globalData.gIsPlayingMusic = true;
    })
    wx.onBackgroundAudioStop(() => {
      self.setData({
        isPlayingMusic: false
      })
      app.globalData.gIsPlayingMusic = false;
      app.globalData.gCurrentMusicPostId = null;
    })
  },

  onCollectionTap: function (event) {
    const {
      collected,
      currentPostId
    } = this.data;
    const self = this;
    const postsCollected = wx.getStorageSync('postsCollected');
    postsCollected[currentPostId] = !collected;
    wx.setStorageSync('postsCollected', postsCollected);
    self.setData({
      collected: !collected
    })
    this.showToast(!collected)
  },

  showToast: function (flag) {
    wx.showToast({
      title: `${flag?"收藏":"取消"}成功`,
      duration: 1000,
      icon: "success"
    })
  },

  showModal: function (self, postsCollected, collected, currentPostId) {
    wx.showModal({
      title: "收藏",
      content: `${collected?'取消':''}收藏该文章？`,
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function (res) {
        wx.showToast({
          title: `${res.confirm?"收藏":"取消"}成功`,
          duration: 1000,
          icon: "success"
        })
        postsCollected[currentPostId] = res.confirm;
        wx.setStorageSync('postsCollected', postsCollected);
        self.setData({
          collected: res.confirm
        })
      }
    })
  },

  onShareTap: function (event) {
    const itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博",
    ];
    wx.showActionSheet({
      itemList,
      itemColor: "#405f80",
      success: function (res) {
        const {
          cancel,
          tapIndex
        } = res;
        wx.showModal({
          title: itemList[tapIndex],
          content: "小程序暂无实现分享功能"
        })
      }
    })
  },

  onMusicTap: function (event) {
    const {
      isPlayingMusic,
      currentPostId
    } = this.data;
    const {
      music: {
        dataUrl,
        title,
        coverImg
      }
    } = posts[currentPostId];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
    } else {
      wx.playBackgroundAudio({
        dataUrl,
        title,
        coverImg,
      })
    }
    app.globalData.gCurrentMusicPostId = currentPostId;
    this.setData({
      isPlayingMusic: !isPlayingMusic
    })
  }
})
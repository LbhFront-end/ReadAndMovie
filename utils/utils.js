function convertToStarsArray(stars) {
  const num = stars.toString().substring(0, 1);
  const array = [];
  for (let i = 1; i <= 5; i += 1) {
    if (i <= num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array;
}

function formatMovieTitle(title) {
  return title.length >= 6 ? `${title.substring(0,6)}...` : title;
}

function http(url, callback) {
  wx.request({
    url,
    method: 'GET',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res) {
        callback(res.data)
      }
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

function covertToCastString(casts) {
  let castsjoin = "";
  for (let idx in casts) {
    castsjoin = `${castsjoin}${casts[idx].name} / `;
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function covertToCastInfos(casts) {
  const castsArray = [];
  casts.forEach(item => {
    castsArray.push({
      img: item.avatars ? item.avatars.large : "",
      name: item.name
    })
  });
  return castsArray;
}

module.exports = {
  convertToStarsArray,
  formatMovieTitle,
  http,
  covertToCastString,
  covertToCastInfos
}
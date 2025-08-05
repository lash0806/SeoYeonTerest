// X投稿URLリストから埋め込みギャラリーを生成
document.getElementById('gallery').innerHTML = '<p>読み込み中...</p>';
fetch('x_links.txt')
  .then(res => res.text())
  .then(text => {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    lines.forEach(line => {
      // フォーマット: URL,アイコンファイル名
      const [url, icon] = line.split(',').map(x => x && x.trim());
      // ラッパーdivを作成
      const wrapper = document.createElement('div');
      wrapper.className = 'tweet-wrapper';
      // アイコン画像を追加
      if (icon) {
        const iconImg = document.createElement('img');
        iconImg.src = `icons/${icon}`;
        iconImg.alt = '投稿者アイコン';
        iconImg.className = 'tweet-usericon';
        wrapper.appendChild(iconImg);
      }
      // ツイート埋め込み
      const tweet = document.createElement('blockquote');
      tweet.className = 'twitter-tweet';
      tweet.innerHTML = `<a href="${url}"></a>`;
      wrapper.appendChild(tweet);
      gallery.appendChild(wrapper);
    });
    if(window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(gallery);
      // ツイート埋め込み完了後に高さ調整
      window.twttr.events && window.twttr.events.bind('rendered', adjustTweetHeights);
      // 念のためロード後にも実行
      setTimeout(adjustTweetHeights, 1500);
      window.addEventListener('resize', adjustTweetHeights);
    }

    function adjustTweetHeights() {
      if(window.innerWidth > 600) return; // スマホのみ
      document.querySelectorAll('.tweet-wrapper').forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        if(iframe) {
          let h = iframe.offsetHeight;
          if(h === 0 && iframe.getBoundingClientRect) {
            h = iframe.getBoundingClientRect().height;
          }
          if(h > 0) {
            wrapper.style.height = (h * 0.8) + 'px';
          }
        }
      });
    }
    // 1秒ごとに高さ再調整（Safari等の遅延対策）
    setInterval(adjustTweetHeights, 1000);

  })
  .catch(err => {
    document.getElementById('gallery').innerHTML = '<p>X投稿リストの読み込みに失敗しました。</p>';
  });
